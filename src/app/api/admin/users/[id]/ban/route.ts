import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

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
    const { banned } = body;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { banned: !!banned }
    });

    revalidatePath("/admin/users");
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("更新用户禁用状态错误:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

