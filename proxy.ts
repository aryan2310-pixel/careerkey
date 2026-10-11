import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyToken(token);
  const isLoginPage = pathname === "/admin-portal/login";

  // not logged in -> login page (remember where they were going)
  if (!session && !isLoginPage) {
    const url = new URL("/admin-portal/login", req.url);
    if (pathname !== "/admin-portal") url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(COOKIE_NAME); // clear an expired/invalid cookie
    return res;
  }

  // already logged in -> no need to see the login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/admin-portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-portal/:path*"],
};