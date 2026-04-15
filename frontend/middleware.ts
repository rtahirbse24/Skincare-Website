import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {    const { pathname } = request.nextUrl;

    // ✅ Redirect root to default locale
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.next(); // prevent crash
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};