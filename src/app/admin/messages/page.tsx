import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { deleteMessage } from "./actions";
import { redirect } from "next/navigation";

export default async function AdminMessagesPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">留言管理</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">查看并删除不合适的留言（无审核队列）。</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 text-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{m.name || "访客"}</span>
              <span>{m.createdAt.toLocaleString("zh-CN", { hour12: false })}</span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{m.content}</p>
            <form
              action={async () => {
                "use server";
                await deleteMessage(m.id);
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-red-200 dark:border-red-700 text-red-600 text-xs px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/40"
              >
                删除
              </button>
            </form>
          </div>
        ))}
        {!messages.length && <div className="text-sm text-gray-500">暂无留言</div>}
      </div>
    </div>
  );
}

