import { prisma } from "@/lib/prisma";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";

export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  summary?: string | null;
  cover?: string | null;
  readingTime?: string;
};

export const getPostSlugs = async () =>
  (await prisma.post.findMany({ where: { status: "published" }, select: { slug: true } })).map(
    (p) => p.slug
  );

export const getPostBySlug = async (slug: string) => {
  const post = await prisma.post.findUnique({ 
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      date: true,
      tags: true,
      summary: true,
      cover: true,
      content: true,
      status: true,
      views: true
    }
  });
  if (!post || post.status !== "published") return null;

  // 检测内容是 HTML 还是 Markdown
  // HTML 内容通常以 < 开头，Markdown 通常以文本开头
  const isHTML = post.content.trim().startsWith("<");
  
  if (isHTML) {
    // 如果是 HTML，直接返回原始内容和类型标识
    return { post, content: post.content, contentType: "html" as const };
  }

  // 如果是 Markdown，使用 MDX 编译
  try {
    const { content: compiledContent } = await compileMDX({
      source: post.content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolink,
              {
                behavior: "wrap"
              }
            ],
            rehypePrism
          ]
        }
      }
    });
    return { post, content: compiledContent, contentType: "mdx" as const };
  } catch (error) {
    console.error("MDX 编译错误:", error);
    // 如果编译失败，回退到 HTML 渲染
    return { post, content: post.content, contentType: "html" as const };
  }
};

export const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { date: "desc" }
  });
  return posts;
};

export const getAllTags = async () => {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { tags: true }
  });
  const tagMap = new Map<string, number>();
  posts.forEach((p) => {
    const arr = p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    arr.forEach((tag) => tagMap.set(tag, (tagMap.get(tag) || 0) + 1));
  });
  return Array.from(tagMap.entries()).map(([tag, count]) => ({ tag, count }));
};

export const getPostsByTag = async (tag: string) => {
  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      tags: { contains: tag }
    },
    orderBy: { date: "desc" }
  });
  return posts;
};

