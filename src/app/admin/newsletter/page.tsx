import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/client";
import { Button } from "@/components/ui/button";
import { dictionaries } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Newsletter",
};

export default async function AdminNewsletterPage() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isLocale(localeCookie) ? localeCookie : defaultLocale;
  const t = dictionaries[locale].admin;

  let subscribers: Awaited<ReturnType<typeof prisma.newsletterSubscriber.findMany>> = [];
  let loadError: string | null = null;

  try {
    subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    loadError = t.unableToReachDb;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl">{t.newsletter.title}</h1>
        <Button variant="outline" className="rounded-none" asChild>
          <a href="/admin/newsletter/export">{t.newsletter.exportCsv}</a>
        </Button>
      </div>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && (
        <p className="mt-2 text-sm text-muted-foreground">
          {subscribers.length}{" "}
          {subscribers.length === 1 ? t.newsletter.subscriber : t.newsletter.subscribers}
        </p>
      )}

      {subscribers.length > 0 && (
        <div className="mt-6 divide-y divide-border border-y border-border">
          {subscribers.map((s) => (
            <div key={s.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3 text-sm">
              <span className="min-w-0 break-all">{s.email}</span>
              <span className="text-muted-foreground">
                {s.createdAt.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
