import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/server/db/client";
import { formatPrice } from "@/lib/format";
import { OrderStatusEditor } from "@/components/admin/order-status-editor";

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

  let order: Awaited<ReturnType<typeof getOrder>> = null;
  let loadError: string | null = null;

  try {
    order = await getOrder(id);
  } catch {
    loadError = "Unable to reach the database.";
  }

  if (loadError) return <p className="text-sm text-destructive">{loadError}</p>;
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">{order.orderNumber}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg">Items</h2>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span>
                    {item.titleSnapshot} · Qty {item.quantity}
                  </span>
                  <span>{formatPrice(Number(item.lineTotal), order.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal), order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(Number(order.shippingCost), order.currency)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Total</span>
                <span>{formatPrice(Number(order.total), order.currency)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg">Customer &amp; Shipping</h2>
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
              {order.shippingNotes && <p>Shipping notes: {order.shippingNotes}</p>}
              {order.orderNotes && <p>Order notes: {order.orderNotes}</p>}
            </div>
          </div>

          {order.payments.length > 0 && (
            <div>
              <h2 className="text-lg">Payments</h2>
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
