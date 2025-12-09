import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateCommentStatus, deleteComment } from "@/lib/comments";

export const runtime = "nodejs";

// PUT: 更新评论状态
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["approved", "pending", "spam"].includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    const comment = await updateCommentStatus(params.id, status);
    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    console.error("更新评论错误:", error);
    return NextResponse.json({ error: "更新评论失败" }, { status: 500 });
  }
}

// DELETE: 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    await deleteComment(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("删除评论错误:", error);
    return NextResponse.json({ error: "删除评论失败" }, { status: 500 });
  }
}

