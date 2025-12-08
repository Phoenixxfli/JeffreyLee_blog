export const runtime = "nodejs";

import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// 错误处理
export async function GET(request: Request) {
  try {
    const { GET: handler } = handlers;
    return await handler(request);
  } catch (error) {
    console.error("NextAuth GET error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { POST: handler } = handlers;
    return await handler(request);
  } catch (error) {
    console.error("NextAuth POST error:", error);
    return new Response(
      JSON.stringify({ error: "Authentication error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
