import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createComment, getCommentsByPostId } from "@/lib/comments";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: 获取文章评论
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "缺少 postId 参数" }, { status: 400 });
  }

  try {
    const comments = await getCommentsByPostId(postId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error("获取评论错误:", error);
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 });
  }
}

// POST: 创建评论
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录后再评论" }, { status: 401 });
    }

    // 检查是否被拉黑
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { banned: true } });
    if (dbUser?.banned) {
      return NextResponse.json({ error: "您的账号已被禁用，无法发表评论" }, { status: 403 });
    }

    const body = await request.json();
    const { postId, parentId, content, name, email } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: "postId 和 content 不能为空" }, { status: 400 });
    }

    const comment = await createComment({
      postId,
      userId: session?.user?.id,
      parentId: parentId || undefined,
      name: session?.user?.name || name,
      email: session?.user?.email || email,
      content
    });

    return NextResponse.json({ 
      success: true, 
      comment,
      message: "评论已发布"
    });
  } catch (error: any) {
    console.error("创建评论错误:", error);
    return NextResponse.json({ error: error.message || "创建评论失败" }, { status: 500 });
  }
}

