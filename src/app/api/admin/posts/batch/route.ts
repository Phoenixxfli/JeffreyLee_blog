import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "无效的 IDs" }, { status: 400 });
    }

    await prisma.post.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/posts");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("批量删除文章错误:", error);
    return NextResponse.json({ error: "批量删除失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "无效的 IDs" }, { status: 400 });
    }

    if (!status || !["published", "draft"].includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    await prisma.post.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        status
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/posts");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("批量更新文章错误:", error);
    return NextResponse.json({ error: "批量更新失败" }, { status: 500 });
  }
}

