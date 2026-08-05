"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validation/settings";
import { updateSiteSettings } from "@/server/actions/settings";
import { useLocale } from "@/components/providers/locale-provider";

export function SettingsForm({ defaultValues }: { defaultValues: SiteSettingsInput }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues,
  });

  async function onSubmit(values: SiteSettingsInput) {
    setSubmitting(true);
    setStatus("idle");
    try {
      const result = await updateSiteSettings(values);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-5" noValidate>
      <div>
        <Label htmlFor="storeName">{t.admin.settings.storeName}</Label>
        <Input id="storeName" className="mt-2" {...form.register("storeName")} />
        {form.formState.errors.storeName && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.storeName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="tagline">{t.admin.settings.tagline}</Label>
        <Input id="tagline" className="mt-2" {...form.register("tagline")} />
      </div>
      <div>
        <Label htmlFor="supportEmail">{t.admin.settings.supportEmail}</Label>
        <Input id="supportEmail" type="email" className="mt-2" {...form.register("supportEmail")} />
        {form.formState.errors.supportEmail && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.supportEmail.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="instagramUrl">{t.admin.settings.instagramUrl}</Label>
        <Input id="instagramUrl" className="mt-2" {...form.register("instagramUrl")} />
      </div>
      <div>
        <Label htmlFor="defaultCurrency">{t.admin.settings.defaultCurrency}</Label>
        <Input id="defaultCurrency" className="mt-2" {...form.register("defaultCurrency")} />
      </div>
      <div>
        <Label htmlFor="defaultLanguage">{t.admin.settings.defaultLanguage}</Label>
        <Input id="defaultLanguage" className="mt-2" {...form.register("defaultLanguage")} />
      </div>

      {status === "error" && error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {status === "saved" && <p className="text-sm text-brand">{t.admin.settings.settingsSaved}</p>}

      <Button type="submit" className="rounded-none" disabled={submitting}>
        {submitting ? t.admin.saving : t.admin.settings.saveSettings}
      </Button>
    </form>
  );
}
