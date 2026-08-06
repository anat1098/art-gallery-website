import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSiteSettings } from "@/server/services/get-site-settings";
import { getSiteContent } from "@/server/services/get-site-content";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <>
      <SiteHeader storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        settings={settings}
        taglineOverrides={{ en: content.footerTaglineEn, he: content.footerTaglineHe }}
      />
    </>
  );
}
