import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "./jwt";

// for server components
export async function getSession() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

// for route handlers: returns the session, or null if not logged in
export async function requireAdmin(req: NextRequest) {
  return verifyToken(req.cookies.get(COOKIE_NAME)?.value);
}

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });