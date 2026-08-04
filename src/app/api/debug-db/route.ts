import { prisma } from "@/server/db/client";

// TEMPORARY diagnostic route — remove after debugging the production
// database connection. Reports the raw error instead of a generic message.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    return Response.json({ ok: true, result });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        message: err instanceof Error ? err.message : String(err),
        name: err instanceof Error ? err.name : undefined,
        stack: err instanceof Error ? err.stack : undefined,
        hasDbUrl: Boolean(process.env.DATABASE_URL),
        dbUrlHost: process.env.DATABASE_URL
          ? new URL(process.env.DATABASE_URL).host
          : null,
      },
      { status: 500 }
    );
  }
}
