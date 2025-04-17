import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/", "/dashboard"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
