import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname === "/admin" && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  if (pathname.startsWith("/admin/dashboard") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (pathname === "/seller" && token?.role === "seller") {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }
  if (pathname.startsWith("/seller/dashboard") && token?.role !== "seller") {
    return NextResponse.redirect(new URL("/seller", request.url));
  }
  const authPages = ["/login", "/register"];
  if (authPages.includes(pathname) && token?.role === "user") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const protectedUserRoutes = ["/profile", "/address", "/cart", "/checkout"];
  if (protectedUserRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token.role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/login",
    "/register",
    "/profile/:path*",
    "/address/:path*",
    "/cart/:path*",
    "/checkout/:path*",
  ],
};
