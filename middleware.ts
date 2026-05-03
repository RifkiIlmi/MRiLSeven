import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Jangan proteksi halaman login
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Proteksi route admin & mutasi API posts
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/posts") &&
    ["POST", "PUT", "DELETE"].includes(req.method);

  if (isAdminPage || isProtectedApi) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      if (isAdminPage) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      if (isAdminPage) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.json(
        { success: false, error: "Token tidak valid" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/posts/:path*", "/login"],
};
