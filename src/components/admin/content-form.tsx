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

const fields: { name: keyof SiteContentInput; label: string }[] = [
  { name: "printsSubheadingEn", label: "Prints Page Subheading (English)" },
  { name: "printsSubheadingHe", label: "Prints Page Subheading (Hebrew)" },
  { name: "originalsSubheadingEn", label: "Originals Page Subheading (English)" },
  { name: "originalsSubheadingHe", label: "Originals Page Subheading (Hebrew)" },
  { name: "homeAboutBodyEn", label: "Homepage About Teaser Text (English)" },
  { name: "homeAboutBodyHe", label: "Homepage About Teaser Text (Hebrew)" },
  { name: "aboutBody1En", label: "About Page — Paragraph 1 (English)" },
  { name: "aboutBody1He", label: "About Page — Paragraph 1 (Hebrew)" },
  { name: "aboutBody2En", label: "About Page — Paragraph 2 (English)" },
  { name: "aboutBody2He", label: "About Page — Paragraph 2 (Hebrew)" },
];

export function ContentForm({ defaultValues }: { defaultValues: SiteContentInput }) {
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
      <p className="text-sm text-muted-foreground">
        Leave a field blank to use the site&apos;s default text.
      </p>
      {fields.map((field) => (
        <div key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            id={field.name}
            className="mt-2"
            rows={2}
            dir={field.name.endsWith("He") ? "rtl" : "ltr"}
            {...form.register(field.name)}
          />
        </div>
      ))}

      {status === "error" && error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {status === "saved" && <p className="text-sm text-brand">Content saved.</p>}

      <Button type="submit" className="rounded-none" disabled={submitting}>
        {submitting ? "Saving…" : "Save Content"}
      </Button>
    </form>
  );
}
