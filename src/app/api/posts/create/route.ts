import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPost } from "@/lib/posts-db";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = (formData.get("title") as string | null)?.trim() || "";
    const slug = (formData.get("slug") as string | null)?.trim() || "";
    const date = new Date((formData.get("date") as string) || Date.now());
    const tags = (formData.get("tags") as string | null)?.trim() || "";
    const summary = (formData.get("summary") as string | null)?.trim() || "";
    const content = (formData.get("content") as string | null) || "";
    const status = (formData.get("status") as string | null) === "draft" ? "draft" : "published";

    if (!title || !slug) {
      return NextResponse.json({ error: "标题和 Slug 不能为空" }, { status: 400 });
    }

    await createPost({
      title,
      slug,
      date,
      tags,
      summary: summary || undefined,
      content,
      status
    });

    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/tags");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/admin/posts");

    return NextResponse.json({ success: true, message: status === "published" ? "发布成功" : "已保存为草稿" });
  } catch (error: any) {
    console.error("创建文章错误:", error);
    return NextResponse.json(
      { error: error.message || "创建文章失败" },
      { status: 500 }
    );
  }
}

