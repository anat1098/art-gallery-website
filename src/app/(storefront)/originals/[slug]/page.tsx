import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArtworkGallery } from "@/components/gallery/artwork-gallery";
import { OriginalPurchasePanel } from "@/components/gallery/original-purchase-panel";
import { RelatedArtworks } from "@/components/gallery/related-artworks";
import { ProductInfoTabs } from "@/components/gallery/product-info-tabs";
import {
  allOriginals,
  getArtworkBySlug,
  getRelatedArtworks,
} from "@/lib/constants/placeholder-artworks";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { localizeDetail } from "@/lib/localize-artwork";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

type OriginalPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allOriginals.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: OriginalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = getArtworkBySlug("ORIGINAL", slug);
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description,
  };
}

export default async function OriginalPage({ params }: OriginalPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug("ORIGINAL", slug);
  if (!artwork) notFound();

  const related = getRelatedArtworks(artwork);
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const localized = localizeDetail(artwork, locale);
  const content = await getSiteContent();
  const careInfo = resolveContent(locale, content.careInfoEn, content.careInfoHe, t.artwork.careInfoBody);
  const returnsPolicy = resolveContent(locale, content.returnsPolicyEn, content.returnsPolicyHe, t.artwork.returnsBody);
  const shipping = resolveContent(locale, content.shippingInfoEn, content.shippingInfoHe, t.artwork.shippingBody);

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16">
        <ArtworkGallery images={artwork.images} />

        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {localized.categoryName} · {t.originals.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl lg:text-5xl">&lsquo;{localized.title}&rsquo;</h1>
          <p className="mt-6 max-w-md text-muted-foreground">{localized.description}</p>
          {artwork.materials && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t.artwork.materials}: {artwork.materials}
            </p>
          )}

          <OriginalPurchasePanel artwork={artwork} />

          <ProductInfoTabs
            careInfo={careInfo}
            returnsPolicy={returnsPolicy}
            shipping={shipping}
            about={localized.description}
          />
        </div>
      </div>

      <RelatedArtworks artworks={related} />
    </div>
  );
}
