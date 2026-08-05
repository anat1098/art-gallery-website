import type { Metadata } from "next";
import { cookies } from "next/headers";
import { RegisterForm } from "@/components/auth/register-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Create Account",
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  return (
    <div className="mx-auto max-w-sm px-6 py-20 lg:py-28">
      <h1 className="text-3xl">{t.auth.register}</h1>
      <p className="mt-3 text-muted-foreground">{t.auth.registerWelcome}</p>
      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
}
