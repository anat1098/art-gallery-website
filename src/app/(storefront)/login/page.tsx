import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Log In",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-sm flex-col justify-center px-6 py-16 lg:min-h-0 lg:py-28">
      <div className="text-center">
        <h1 className="text-3xl">{t.auth.login}</h1>
        <p className="mt-3 text-muted-foreground">{t.auth.loginWelcome}</p>
      </div>
      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}
