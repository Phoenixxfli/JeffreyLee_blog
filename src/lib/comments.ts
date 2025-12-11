import { prisma } from "./prisma";

export type CommentStatus = "approved" | "pending" | "spam";

export async function getCommentsByPostId(postId: string) {
  return prisma.comment.findMany({
    where: {
      postId,
      status: "approved",
      parentId: null // 只获取顶级评论
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      replies: {
        where: {
          status: "approved"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createComment(data: {
  postId: string;
  userId?: string;
  parentId?: string;
  name?: string;
  email?: string;
  content: string;
  status?: CommentStatus;
}) {
  return prisma.comment.create({
    data: {
      postId: data.postId,
      userId: data.userId,
      parentId: data.parentId,
      name: data.name,
      email: data.email,
      content: data.content,
      status: data.status || "approved" // 默认直接发布，可由管理员删除/标记垃圾
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      }
    }
  });
}

export async function getAllComments() {
  return prisma.comment.findMany({
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true
        }
      },
      parent: {
        select: {
          id: true,
          content: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function updateCommentStatus(id: string, status: CommentStatus) {
  return prisma.comment.update({
    where: { id },
    data: { status }
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: { id }
  });
}

export async function getCommentCountByPostId(postId: string) {
  return prisma.comment.count({
    where: {
      postId,
      status: "approved"
    }
  });
}

