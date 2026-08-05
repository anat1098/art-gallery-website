import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAccountRoute = pathname.startsWith("/account");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCartRoute = pathname.startsWith("/cart");
  const isCheckoutRoute = pathname.startsWith("/checkout");

  if ((isAccountRoute || isAdminRoute || isCartRoute || isCheckoutRoute) && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && req.auth?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/cart/:path*", "/checkout/:path*"],
};
