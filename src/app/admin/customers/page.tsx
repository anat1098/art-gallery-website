import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { CustomerActiveToggle } from "@/components/admin/customer-active-toggle";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  let customers: Array<{
    id: string;
    name: string | null;
    email: string;
    isActive: boolean;
    createdAt: Date;
    _count: { orders: number };
  }> = [];
  let loadError: string | null = null;

  try {
    customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Customers</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && customers.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No customers yet.</p>
      )}

      {customers.length > 0 && (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {customers.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
              <div className="min-w-0">
                <p className="text-sm">{c.name ?? "—"}</p>
                <p className="text-xs break-all text-muted-foreground">
                  {c.email} · Joined {c.createdAt.toLocaleDateString()} ·{" "}
                  {c._count.orders} order{c._count.orders === 1 ? "" : "s"}
                </p>
              </div>
              <CustomerActiveToggle id={c.id} initialValue={c.isActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
