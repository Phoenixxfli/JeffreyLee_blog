import { prisma } from "./prisma";

export type PostStatus = "published" | "draft";

export const postSelect = {
  id: true,
  title: true,
  slug: true,
  date: true,
  tags: true,
  summary: true,
  cover: true,
  status: true,
  updatedAt: true
};

export async function listPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "published" },
    select: postSelect,
    orderBy: { date: "desc" }
  });
}

export async function listPublishedByTag(tag: string) {
  return prisma.post.findMany({
    where: {
      status: "published",
      tags: { contains: tag }
    },
    select: postSelect,
    orderBy: { date: "desc" }
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug }
    // 默认包含所有字段，包括 content
  });
}

export async function getPostFullById(id: string) {
  return prisma.post.findUnique({
    where: { id }
  });
}

export async function createPost(data: {
  title: string;
  slug: string;
  date: Date;
  tags: string;
  summary?: string;
  cover?: string;
  content: string;
  status: PostStatus;
}) {
  return prisma.post.create({ data });
}

export async function updatePost(id: string, data: Partial<Parameters<typeof createPost>[0]>) {
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}

