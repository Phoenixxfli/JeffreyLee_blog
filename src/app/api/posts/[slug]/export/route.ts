import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  try {
    const result = await getPostBySlug(params.slug, true); // 允许草稿
    if (!result) {
      return NextResponse.json({ error: "文章未找到" }, { status: 404 });
    }

    const { post } = result;
    const format = request.nextUrl.searchParams.get("format") || "markdown";

    if (format === "markdown") {
      // 导出为 Markdown
      const frontmatter = `---
title: ${post.title}
slug: ${post.slug}
date: ${post.date.toISOString()}
tags: ${post.tags}
summary: ${post.summary || ""}
cover: ${post.cover || ""}
status: ${post.status}
---

`;
      
      // 如果是 HTML，尝试转换为 Markdown（简单处理）
      let markdownContent = post.content;
      if (post.content.trim().startsWith("<")) {
        // 简单的 HTML 到 Markdown 转换
        markdownContent = post.content
          .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
          .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
          .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
          .replace(/<p>(.*?)<\/p>/gi, "$1\n")
          .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
          .replace(/<em>(.*?)<\/em>/gi, "*$1*")
          .replace(/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)")
          .replace(/<img src="(.*?)" alt="(.*?)"\/?>/gi, "![$2]($1)")
          .replace(/<[^>]+>/g, "")
          .trim();
      }

      return new NextResponse(frontmatter + markdownContent, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${post.slug}.md"`
        }
      });
    }

    // JSON 格式
    return NextResponse.json({
      title: post.title,
      slug: post.slug,
      date: post.date.toISOString(),
      tags: post.tags,
      summary: post.summary,
      cover: post.cover,
      content: post.content,
      status: post.status
    });
  } catch (error: any) {
    console.error("导出文章错误:", error);
    return NextResponse.json({ error: "导出失败" }, { status: 500 });
  }
}

