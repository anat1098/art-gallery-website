import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Newsletter",
};

export default async function AdminNewsletterPage() {
  let subscribers: Awaited<ReturnType<typeof prisma.newsletterSubscriber.findMany>> = [];
  let loadError: string | null = null;

  try {
    subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Newsletter</h1>
        <Button variant="outline" className="rounded-none" asChild>
          <a href="/admin/newsletter/export">Export CSV</a>
        </Button>
      </div>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && (
        <p className="mt-2 text-sm text-muted-foreground">
          {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
        </p>
      )}

      {subscribers.length > 0 && (
        <div className="mt-6 divide-y divide-border border-y border-border">
          {subscribers.map((s) => (
            <div key={s.id} className="flex justify-between py-3 text-sm">
              <span>{s.email}</span>
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
