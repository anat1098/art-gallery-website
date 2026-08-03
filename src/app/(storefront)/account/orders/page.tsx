import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/client";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "My Orders",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PREPARING: "Preparing",
  PRINTED: "Printed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function OrdersPage() {
  const session = await auth();

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let loadError: string | null = null;

  if (session?.user?.id) {
    try {
      orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      loadError = "We couldn't load your orders right now. Please try again shortly.";
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
      <h1>My Orders</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && orders.length === 0 && (
        <p className="mt-6 text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
      )}

      {orders.length > 0 && (
        <div className="mt-10 divide-y divide-border border-y border-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 py-6"
            >
              <div>
                <p className="font-display text-lg">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </p>
                {order.trackingNumber && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tracking: {order.trackingNumber}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {statusLabels[order.status] ?? order.status}
                </Badge>
                <p>{formatPrice(Number(order.total), order.currency)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
