import type { Metadata } from "next";
import { cookies } from "next/headers";
import { InstagramIcon } from "@/components/shared/icons";
import { Mail } from "lucide-react";
import { siteSettings } from "@/lib/constants/site";
import { ContactForm } from "@/components/contact/contact-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  return (
    <div className="mx-auto max-w-xl px-6 py-14 lg:px-10 lg:py-20">
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        {t.contact.eyebrow}
      </p>
      <h1 className="mt-3">{t.contact.title}</h1>
      <p className="mt-4 text-muted-foreground">{t.contact.body}</p>

      <div className="mt-8 flex flex-col gap-2 text-sm">
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

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
