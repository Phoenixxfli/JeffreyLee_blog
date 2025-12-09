import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 增加阅读量
    await prisma.post.update({
      where: { slug: params.slug },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("更新阅读量错误:", error);
    return NextResponse.json({ error: "更新阅读量失败" }, { status: 500 });
  }
}

