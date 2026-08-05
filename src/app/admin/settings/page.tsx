import type { Metadata } from "next";
import { getSiteSettings } from "@/server/services/get-site-settings";
import { getSiteContent } from "@/server/services/get-site-content";
import { SettingsForm } from "@/components/admin/settings-form";
import { ContentForm } from "@/components/admin/content-form";

export const metadata: Metadata = {
  title: "Store Settings",
};

export default async function AdminSettingsPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Store Settings</h1>
      <div className="mt-8">
        <SettingsForm defaultValues={settings} />
      </div>

      <h2 className="mt-14 text-xl">Section Text</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit the subheading and paragraph text shown on the homepage, prints,
        originals, and about pages.
      </p>
      <div className="mt-6">
        <ContentForm defaultValues={content} />
      </div>
    </div>
  );
}
