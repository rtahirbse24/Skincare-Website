import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
try {
const { pathname } = request.nextUrl;

// ✅ Redirect root → /en
if (pathname === "/") {
  return NextResponse.redirect(new URL("/en", request.url));
}

// ✅ ONLY redirect specific admin pages (NOT all)
if (
  pathname === "/en/admin/dashboard" ||
  pathname === "/en/admin/coupons"
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
matcher: ["/((?!api|_next|_vercel|.*\..*).*)"],
};
