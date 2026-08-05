import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArtworkPlaceholder } from "@/components/shared/artwork-placeholder";
import { Button } from "@/components/ui/button";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const content = await getSiteContent();
  const body1 = resolveContent(locale, content.aboutBody1En, content.aboutBody1He, t.about.body1);
  const body2 = resolveContent(locale, content.aboutBody2En, content.aboutBody2He, t.about.body2);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {t.about.eyebrow}
        </p>
        <h1 className="mt-3">{t.about.title}</h1>
      </div>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden">
          <ArtworkPlaceholder seed="about-page" className="h-full w-full" />
        </div>

        <div className="space-y-6 text-muted-foreground">
          <p>{body1}</p>
          <p>{body2}</p>
          <Button variant="outline" size="lg" className="rounded-none px-8" asChild>
            <Link href="/contact">{t.about.contactCta}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
