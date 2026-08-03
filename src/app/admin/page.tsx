import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/server/db/client";
import { StatCard } from "@/components/admin/stat-card";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin Overview",
};

async function getStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const [
    orderCount,
    customerCount,
    revenueAgg,
    revenueThisMonthAgg,
    revenueThisYearAgg,
    printsSold,
    originalsSold,
    recentOrders,
    lowInventorySizes,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: startOfYear } },
    }),
    prisma.orderItem.count({ where: { artwork: { type: "PRINT" } } }),
    prisma.orderItem.count({ where: { artwork: { type: "ORIGINAL" } } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.printSize.findMany({
      where: { inventory: { lt: 5 } },
      take: 5,
      include: { artwork: { select: { title: true } } },
    }),
  ]);

  return {
    orderCount,
    customerCount,
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    revenueThisMonth: Number(revenueThisMonthAgg._sum.total ?? 0),
    revenueThisYear: Number(revenueThisYearAgg._sum.total ?? 0),
    printsSold,
    originalsSold,
    recentOrders,
    lowInventorySizes,
  };
}

export default async function AdminOverviewPage() {
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  let loadError: string | null = null;

  try {
    stats = await getStats();
  } catch {
    loadError =
      "Unable to reach the database. Connect a live Postgres instance to see dashboard stats.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Overview</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} />
            <StatCard label="Revenue This Month" value={formatPrice(stats.revenueThisMonth)} />
            <StatCard label="Revenue This Year" value={formatPrice(stats.revenueThisYear)} />
            <StatCard label="Total Orders" value={String(stats.orderCount)} />
            <StatCard label="Total Customers" value={String(stats.customerCount)} />
            <StatCard label="Prints Sold" value={String(stats.printsSold)} />
            <StatCard label="Originals Sold" value={String(stats.originalsSold)} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-lg">Recent Orders</h2>
              {stats.recentOrders.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <div className="mt-3 divide-y divide-border border-y border-border">
                  {stats.recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between py-3 text-sm hover:bg-secondary/50"
                    >
                      <span>{order.orderNumber}</span>
                      <span>{formatPrice(Number(order.total), order.currency)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg">Low Inventory</h2>
              {stats.lowInventorySizes.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nothing running low.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-border border-y border-border">
                  {stats.lowInventorySizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span>
                        {size.artwork.title} — {size.label}
                      </span>
                      <span className="text-destructive">{size.inventory} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
