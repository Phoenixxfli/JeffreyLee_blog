import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  // 允许 /admin/set-admin 页面无需登录访问（用于设置第一个管理员）
  if (nextUrl.pathname === "/admin/set-admin") {
    return NextResponse.next();
  }
  
  const isProtected = ["/upload", "/admin"].some((path) => nextUrl.pathname.startsWith(path));
  if (isProtected && !session?.user?.isAdmin) {
    const redirectUrl = new URL("/auth/signin", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/upload", "/admin/:path*"]
};

