"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  siteContentSchema,
  type SiteContentInput,
} from "@/lib/validation/content";
import { updateSiteContent } from "@/server/actions/content";
import { useLocale } from "@/components/providers/locale-provider";

const fieldBases: { base: string; enKey: keyof SiteContentInput; heKey: keyof SiteContentInput }[] = [
  { base: "printsSubheading", enKey: "printsSubheadingEn", heKey: "printsSubheadingHe" },
  { base: "originalsSubheading", enKey: "originalsSubheadingEn", heKey: "originalsSubheadingHe" },
  { base: "homeAboutBody", enKey: "homeAboutBodyEn", heKey: "homeAboutBodyHe" },
  { base: "aboutBody1", enKey: "aboutBody1En", heKey: "aboutBody1He" },
  { base: "aboutBody2", enKey: "aboutBody2En", heKey: "aboutBody2He" },
  { base: "careInfo", enKey: "careInfoEn", heKey: "careInfoHe" },
  { base: "returnsPolicy", enKey: "returnsPolicyEn", heKey: "returnsPolicyHe" },
  { base: "shippingInfo", enKey: "shippingInfoEn", heKey: "shippingInfoHe" },
  { base: "contactBody", enKey: "contactBodyEn", heKey: "contactBodyHe" },
  { base: "newsletterBody", enKey: "newsletterBodyEn", heKey: "newsletterBodyHe" },
];

export function ContentForm({ defaultValues }: { defaultValues: SiteContentInput }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SiteContentInput>({
    resolver: zodResolver(siteContentSchema),
    defaultValues,
  });

  async function onSubmit(values: SiteContentInput) {
    setSubmitting(true);
    setStatus("idle");
    try {
      const result = await updateSiteContent(values);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-5" noValidate>
      <p className="text-sm text-muted-foreground">{t.admin.settings.leaveBlankHint}</p>
      {fieldBases.map(({ base, enKey, heKey }) => (
        <div key={base} className="space-y-5">
          <div>
            <Label htmlFor={enKey}>
              {t.admin.content[base as keyof typeof t.admin.content]} ({t.admin.content.langEn})
            </Label>
            <Textarea id={enKey} className="mt-2" rows={2} dir="ltr" {...form.register(enKey)} />
          </div>
          <div>
            <Label htmlFor={heKey}>
              {t.admin.content[base as keyof typeof t.admin.content]} ({t.admin.content.langHe})
            </Label>
            <Textarea id={heKey} className="mt-2" rows={2} dir="rtl" {...form.register(heKey)} />
          </div>
        </div>
      ))}

      {status === "error" && error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {status === "saved" && <p className="text-sm text-brand">{t.admin.settings.contentSaved}</p>}

      <Button type="submit" className="rounded-none" disabled={submitting}>
        {submitting ? t.admin.saving : t.admin.settings.saveContent}
      </Button>
    </form>
  );
}
