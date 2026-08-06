"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  siteContentSchema,
  type SiteContentInput,
} from "@/lib/validation/content";
import { updateSiteContent } from "@/server/actions/content";
import { useLocale } from "@/components/providers/locale-provider";

type FieldBase = { base: string; enKey: keyof SiteContentInput; heKey: keyof SiteContentInput };

const groups: { group: string; fields: FieldBase[] }[] = [
  {
    group: "groupHomepage",
    fields: [
      { base: "heroSubtitle", enKey: "heroSubtitleEn", heKey: "heroSubtitleHe" },
      { base: "homeAboutBody", enKey: "homeAboutBodyEn", heKey: "homeAboutBodyHe" },
      { base: "newsletterBody", enKey: "newsletterBodyEn", heKey: "newsletterBodyHe" },
    ],
  },
  {
    group: "groupAbout",
    fields: [
      { base: "aboutBody1", enKey: "aboutBody1En", heKey: "aboutBody1He" },
      { base: "aboutBody2", enKey: "aboutBody2En", heKey: "aboutBody2He" },
    ],
  },
  {
    group: "groupPrints",
    fields: [
      { base: "printsSubheading", enKey: "printsSubheadingEn", heKey: "printsSubheadingHe" },
    ],
  },
  {
    group: "groupOriginals",
    fields: [
      { base: "originalsSubheading", enKey: "originalsSubheadingEn", heKey: "originalsSubheadingHe" },
    ],
  },
  {
    group: "groupContact",
    fields: [{ base: "contactBody", enKey: "contactBodyEn", heKey: "contactBodyHe" }],
  },
  {
    group: "groupProductPages",
    fields: [
      { base: "careInfo", enKey: "careInfoEn", heKey: "careInfoHe" },
      { base: "returnsPolicy", enKey: "returnsPolicyEn", heKey: "returnsPolicyHe" },
      { base: "shippingInfo", enKey: "shippingInfoEn", heKey: "shippingInfoHe" },
    ],
  },
  {
    group: "groupFooter",
    fields: [{ base: "footerTagline", enKey: "footerTaglineEn", heKey: "footerTaglineHe" }],
  },
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
    <Accordion type="single" collapsible className="max-w-xl">
      <AccordionItem value="section-text">
        <AccordionTrigger className="text-xl font-normal hover:no-underline">
          {t.admin.settings.sectionText}
        </AccordionTrigger>
        <AccordionContent>
          <p className="mb-1 text-sm text-muted-foreground">{t.admin.settings.sectionTextHint}</p>
          <p className="mb-5 text-sm text-muted-foreground">{t.admin.settings.leaveBlankHint}</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <Accordion type="multiple" className="border-t border-border">
              {groups.map(({ group, fields }) => (
                <AccordionItem key={group} value={group}>
                  <AccordionTrigger className="text-sm font-medium tracking-wide uppercase">
                    {t.admin.settings[group as keyof typeof t.admin.settings]}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-5 pt-1">
                      {fields.map(({ base, enKey, heKey }) => (
                        <div key={base} className="space-y-4">
                          <div>
                            <Label htmlFor={enKey}>
                              {t.admin.content[base as keyof typeof t.admin.content]} (
                              {t.admin.content.langEn})
                            </Label>
                            <Textarea
                              id={enKey}
                              className="mt-2"
                              rows={2}
                              dir="ltr"
                              {...form.register(enKey)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={heKey}>
                              {t.admin.content[base as keyof typeof t.admin.content]} (
                              {t.admin.content.langHe})
                            </Label>
                            <Textarea
                              id={heKey}
                              className="mt-2"
                              rows={2}
                              dir="rtl"
                              {...form.register(heKey)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {status === "error" && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {status === "saved" && (
              <p className="text-sm text-brand">{t.admin.settings.contentSaved}</p>
            )}

            <Button type="submit" className="rounded-none" disabled={submitting}>
              {submitting ? t.admin.saving : t.admin.settings.saveContent}
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
