import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // ✅ Redirect root → /en
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/en", request.url));
    }

    // ✅ Redirect admin subroutes → /en/admin
    if (
      pathname.startsWith("/en/admin/") &&
      pathname !== "/en/admin"
    ) {
      return NextResponse.redirect(new URL("/en/admin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};