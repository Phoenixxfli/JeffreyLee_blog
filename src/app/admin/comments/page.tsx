import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { getAllComments, updateCommentStatus, deleteComment } from "@/lib/comments";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminCommentsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const comments = await getAllComments();

  async function updateStatusAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    if (!id || !status) return;
    await updateCommentStatus(id, status as "approved" | "pending" | "spam");
    revalidatePath("/admin/comments");
  }

  async function deleteAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await deleteComment(id);
    revalidatePath("/admin/comments");
  }

  const statusCounts = {
    approved: comments.filter((c) => c.status === "approved").length,
    pending: comments.filter((c) => c.status === "pending").length,
    spam: comments.filter((c) => c.status === "spam").length
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">评论管理</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          审核、管理所有评论。待审核：{statusCounts.pending}，已通过：{statusCounts.approved}，垃圾：{statusCounts.spam}
        </p>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-xl border p-4 ${
              comment.status === "pending"
                ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20"
                : comment.status === "spam"
                ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comment.user?.name || comment.user?.username || comment.name || "匿名用户"}
                  </span>
                  {comment.user && (
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      已登录
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {comment.createdAt.toLocaleString("zh-CN")}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      comment.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : comment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {comment.status === "approved" ? "已通过" : comment.status === "pending" ? "待审核" : "垃圾"}
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </div>
                <div className="text-xs text-gray-500">
                  文章：
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    className="text-brand hover:underline"
                  >
                    {comment.post.title}
                  </Link>
                  {comment.parent && (
                    <>
                      {" · "}
                      <span className="text-gray-400">回复：{comment.parent.content.slice(0, 50)}...</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {comment.status !== "approved" && (
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-white text-xs hover:bg-green-700"
                    >
                      通过
                    </button>
                  </form>
                )}
                {comment.status !== "pending" && (
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="pending" />
                    <button
                      type="submit"
                      className="rounded-lg bg-yellow-600 px-3 py-1.5 text-white text-xs hover:bg-yellow-700"
                    >
                      待审
                    </button>
                  </form>
                )}
                {comment.status !== "spam" && (
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="spam" />
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-white text-xs hover:bg-red-700"
                    >
                      垃圾
                    </button>
                  </form>
                )}
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-300 text-red-600 px-3 py-1.5 text-xs hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/40"
                  >
                    删除
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && <div className="text-sm text-gray-500">暂无评论</div>}
      </div>
    </div>
  );
}

