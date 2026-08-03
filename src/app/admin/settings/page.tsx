import type { Metadata } from "next";
import { getSiteSettings } from "@/server/services/get-site-settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Store Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl">Store Settings</h1>
      <div className="mt-8">
        <SettingsForm defaultValues={settings} />
      </div>
    </div>
  );
}
