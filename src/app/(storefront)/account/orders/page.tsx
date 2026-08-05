import type { Metadata } from "next";
import { cookies } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db/client";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const session = await auth();
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale];

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let loadError: string | null = null;

  if (session?.user?.id) {
    try {
      orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      loadError = t.account.loadOrdersError;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 lg:px-10 lg:py-20">
      <h1>{t.account.myOrders}</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && orders.length === 0 && (
        <p className="mt-6 text-muted-foreground">{t.account.noOrders}</p>
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
                    {t.account.tracking}: {order.trackingNumber}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {t.orderStatus[order.status as keyof typeof t.orderStatus] ?? order.status}
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
