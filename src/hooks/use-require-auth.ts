"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  function requireAuth(): boolean {
    if (session) return true;
    const loginUrl = new URL("/login", window.location.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    router.push(`${loginUrl.pathname}${loginUrl.search}`);
    return false;
  }

  return { requireAuth, isAuthenticated: !!session, status };
}
