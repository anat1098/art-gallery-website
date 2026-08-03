import { prisma } from "@/server/db/client";

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows = ["email,subscribed_at"];
    for (const s of subscribers) {
      rows.push(`${s.email},${s.createdAt.toISOString()}`);
    }

    return new Response(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=newsletter-subscribers.csv",
      },
    });
  } catch {
    return new Response("Unable to reach the database.", { status: 503 });
  }
}
