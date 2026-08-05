import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { formatPrice } from "@/lib/format";
import { OrderStatusEditor } from "@/components/admin/order-status-editor";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Order Detail",
};

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true },
  });
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let order: Awaited<ReturnType<typeof getOrder>> = null;
  let loadError: string | null = null;

  try {
    order = await getOrder(id);
  } catch {
    loadError = t.unableToReachDb;
  }

  if (loadError) return <p className="text-sm text-destructive">{loadError}</p>;
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">{order.orderNumber}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg">{t.orders.items}</h2>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {item.titleSnapshot} · {t.orders.qty} {item.quantity}
                  </span>
                  <span>{formatPrice(Number(item.lineTotal), order.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.orders.subtotal}</span>
                <span>{formatPrice(Number(order.subtotal), order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.orders.shipping}</span>
                <span>{formatPrice(Number(order.shippingCost), order.currency)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>{t.orders.total}</span>
                <span>{formatPrice(Number(order.total), order.currency)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg">{t.orders.customerAndShipping}</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p className="text-foreground">
                {order.firstName} {order.lastName}
              </p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
              <p>
                {order.street}, {order.city}, {order.postalCode}
              </p>
              <p>{order.country}</p>
              {order.shippingNotes && (
                <p>
                  {t.orders.shippingNotes}: {order.shippingNotes}
                </p>
              )}
              {order.orderNotes && (
                <p>
                  {t.orders.orderNotes}: {order.orderNotes}
                </p>
              )}
            </div>
          </div>

          {order.payments.length > 0 && (
            <div>
              <h2 className="text-lg">{t.orders.payments}</h2>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {order.payments.map((p) => (
                  <p key={p.id}>
                    {p.provider} · {p.status} ·{" "}
                    {formatPrice(Number(p.amount), p.currency)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <OrderStatusEditor
          orderId={order.id}
          initialStatus={order.status}
          initialTrackingNumber={order.trackingNumber ?? ""}
          initialTrackingUrl={order.trackingUrl ?? ""}
        />
      </div>
    </div>
  );
}
