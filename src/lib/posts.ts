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
  const post = await prisma.post.findUnique({ where: { slug, status: "published" } });
  if (!post) return null;

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

  return { post, content: compiledContent };
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

