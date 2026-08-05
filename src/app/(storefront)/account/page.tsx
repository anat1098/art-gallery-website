import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/client";
import { ProfileForm } from "@/components/account/profile-form";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const session = await auth();
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];
  const arrow = locale === "he" ? "←" : "→";

  let user: { name: string | null; email: string; phone: string | null } | null = null;
  let loadError: string | null = null;

  if (session?.user?.id) {
    try {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true },
      });
    } catch {
      loadError = t.account.loadProfileError;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1>{t.account.myAccount}</h1>
        <Link
          href="/account/orders"
          className="text-sm underline underline-offset-4"
        >
          {t.account.viewOrders} {arrow}
        </Link>
      </div>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      <div className="mt-10">
        <ProfileForm
          name={user?.name ?? session?.user?.name ?? ""}
          email={user?.email ?? session?.user?.email ?? ""}
          phone={user?.phone ?? ""}
        />
      </div>
    </div>
  );
}
