"use client";

import { NewsletterForm } from "@/components/home/newsletter-form";
import { useLocale } from "@/components/providers/locale-provider";

export function NewsletterSection({ bodyOverride }: { bodyOverride?: string }) {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center lg:py-28">
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        {t.home.newsletterEyebrow}
      </p>
      <h2 className="mt-3">{t.home.newsletterTitle}</h2>
      <p className="mt-4 text-muted-foreground">{bodyOverride || t.home.newsletterBody}</p>
      <div className="mx-auto mt-8 max-w-sm">
        <NewsletterForm />
      </div>
    </section>
  );
}
