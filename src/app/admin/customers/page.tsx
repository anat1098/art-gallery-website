import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { CustomerActiveToggle } from "@/components/admin/customer-active-toggle";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function AdminCustomersPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

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
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <h1 className="font-display text-2xl">{t.customers.title}</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && customers.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">{t.customers.noCustomersYet}</p>
      )}

      {customers.length > 0 && (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {customers.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
              <div className="min-w-0">
                <p className="text-sm">{c.name ?? "—"}</p>
                <p className="text-xs break-all text-muted-foreground">
                  {c.email} · {t.customers.joined} {c.createdAt.toLocaleDateString()} ·{" "}
                  {c._count.orders} {c._count.orders === 1 ? t.customers.order : t.customers.orders}
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
