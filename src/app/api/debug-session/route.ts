import { auth } from "@/server/auth";

// TEMPORARY diagnostic route — remove after debugging the admin role issue.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  return Response.json({
    hasSession: Boolean(session),
    email: session?.user?.email ?? null,
    role: session?.user?.role ?? null,
    id: session?.user?.id ?? null,
  });
}
