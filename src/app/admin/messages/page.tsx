import type { Metadata } from "next";
import { prisma } from "@/server/db/client";
import { MessageReadToggle } from "@/components/admin/message-read-toggle";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof prisma.contactMessage.findMany>> = [];
  let loadError: string | null = null;

  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    loadError = "Unable to reach the database.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Messages</h1>

      {loadError && (
        <p className="mt-6 text-sm text-destructive">{loadError}</p>
      )}

      {!loadError && messages.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">No messages yet.</p>
      )}

      {messages.length > 0 && (
        <div className="mt-8 divide-y divide-border border-y border-border">
          {messages.map((m) => (
            <div key={m.id} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="min-w-0 text-sm break-all">
                  <span className="font-medium">{m.name}</span>{" "}
                  <span className="text-muted-foreground">
                    &lt;{m.email}&gt; · {m.createdAt.toLocaleDateString()}
                  </span>
                </p>
                <MessageReadToggle id={m.id} initialValue={m.isRead} />
              </div>
              <p className="mt-2 text-sm font-medium">{m.subject}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
