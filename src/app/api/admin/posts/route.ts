import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        tags: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ 
      posts: posts.map((p) => ({
        ...p,
        updatedAt: p.updatedAt.toISOString()
      }))
    });
  } catch (error: any) {
    console.error("获取文章列表错误:", error);
    return NextResponse.json({ error: "获取文章列表失败" }, { status: 500 });
  }
}

