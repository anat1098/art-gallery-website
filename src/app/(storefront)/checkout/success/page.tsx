import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order } = await searchParams;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
      <ClearCartOnMount />
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        {t.checkout.thankYou}
      </p>
      <h1 className="mt-3">{t.checkout.orderConfirmed}</h1>
      {order && (
        <p className="mt-4 text-muted-foreground">
          {t.checkout.orderNumber}{" "}
          <span className="text-foreground">{order}</span>.{" "}
          {t.checkout.confirmationEmail}
        </p>
      )}
      <p className="mt-2 text-muted-foreground">{t.checkout.shipNotification}</p>
      <Button size="lg" className="mt-8 rounded-none px-8" asChild>
        <Link href="/prints">{t.checkout.continueBrowsing}</Link>
      </Button>
    </div>
  );
}
