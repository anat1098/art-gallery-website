import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db/client";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let loadError: string | null = null;

  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Orders</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && orders.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
      )}

      {orders.length > 0 && (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-secondary/50"
            >
              <div>
                <p className="font-display text-lg">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.firstName} {order.lastName} · {order.email} ·{" "}
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{order.status}</Badge>
                <p>{formatPrice(Number(order.total), order.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
