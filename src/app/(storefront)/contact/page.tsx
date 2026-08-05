import type { Metadata } from "next";
import { cookies } from "next/headers";
import { InstagramIcon } from "@/components/shared/icons";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getSiteSettings } from "@/server/services/get-site-settings";
import { getSiteContent, resolveContent } from "@/server/services/get-site-content";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const siteSettings = await getSiteSettings();
  const content = await getSiteContent();
  const body = resolveContent(locale, content.contactBodyEn, content.contactBodyHe, t.contact.body);

  return (
    <div className="mx-auto max-w-xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {t.contact.eyebrow}
        </p>
        <h1 className="mt-3">{t.contact.title}</h1>
        <p className="mt-4 text-muted-foreground">{body}</p>

        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <a
            href={`mailto:${siteSettings.supportEmail}`}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <Mail className="size-4" /> {siteSettings.supportEmail}
          </a>
          <a
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <InstagramIcon className="size-4" /> Instagram
          </a>
        </div>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
