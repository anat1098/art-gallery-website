import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getSiteSettings } from "@/server/services/get-site-settings";
import { getSiteContent } from "@/server/services/get-site-content";
import { SettingsForm } from "@/components/admin/settings-form";
import { ContentForm } from "@/components/admin/content-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Store Settings",
};

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">{t.settings.title}</h1>
      <div className="mt-8">
        <SettingsForm defaultValues={settings} />
      </div>

      <div className="mt-14 border-t border-border pt-2">
        <ContentForm defaultValues={content} />
      </div>
    </div>
  );
}
