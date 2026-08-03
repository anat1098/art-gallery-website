"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/shared/icons";
import { mainNav } from "@/lib/constants/nav";
import { siteSettings } from "@/lib/constants/site";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { useLocale } from "@/components/providers/locale-provider";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { locale, t } = useLocale();

  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-2xl">{siteSettings.storeName}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t.footer.navigate}
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-foreground/80 hover:text-foreground"
                >
                  {locale === "he" ? item.labelHe : item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t.footer.connect}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
              >
                <InstagramIcon className="size-4" /> Instagram
              </a>
              <a
                href={`mailto:${siteSettings.supportEmail}`}
                className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
              >
                <Mail className="size-4" /> {siteSettings.supportEmail}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {year} {siteSettings.storeName}. {t.footer.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
