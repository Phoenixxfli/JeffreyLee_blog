import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
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

