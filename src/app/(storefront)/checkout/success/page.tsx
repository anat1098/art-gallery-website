import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";

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

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center lg:px-10">
      <ClearCartOnMount />
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Thank You
      </p>
      <h1 className="mt-3">Your order is confirmed</h1>
      {order && (
        <p className="mt-4 text-muted-foreground">
          Order number <span className="text-foreground">{order}</span>. A
          confirmation email is on its way.
        </p>
      )}
      <p className="mt-2 text-muted-foreground">
        We&apos;ll notify you as soon as your order ships.
      </p>
      <Button size="lg" className="mt-8 rounded-none px-8" asChild>
        <Link href="/prints">Continue Browsing</Link>
      </Button>
    </div>
  );
}
