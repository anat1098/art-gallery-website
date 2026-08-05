import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const dict = dictionaries[locale];
  const t = dict.admin;

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let loadError: string | null = null;

  try {
    orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <h1 className="font-display text-2xl">{t.orders.title}</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && orders.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">{t.orders.noOrdersYet}</p>
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
                <Badge variant="outline">
                  {dict.orderStatus[order.status as keyof typeof dict.orderStatus] ?? order.status}
                </Badge>
                <p>{formatPrice(Number(order.total), order.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
