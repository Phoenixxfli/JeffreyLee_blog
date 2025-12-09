import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deletePost } from "@/lib/posts-db";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    await deletePost(params.id);
    revalidatePath("/");
    revalidatePath("/admin/posts");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("删除文章错误:", error);
    return NextResponse.json({ error: "删除文章失败" }, { status: 500 });
  }
}

