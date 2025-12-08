import { prisma } from "@/lib/prisma";
import { addMessage } from "./actions";
import SubmitButton from "./SubmitButton";

export default async function GuestbookPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">留言板</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">分享想法、反馈或打个招呼。最多 500 字。</p>
      </div>

      <form action={addMessage} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex gap-4 max-sm:flex-col">
          <input
            name="name"
            placeholder="称呼（可选）"
            maxLength={80}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <textarea
          name="content"
          required
          maxLength={500}
          placeholder="想说点什么..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none h-28"
        />
        <SubmitButton />
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">最近留言</h2>
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 text-sm">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{m.name || "访客"}</span>
                <span>{m.createdAt.toLocaleString("zh-CN", { hour12: false })}</span>
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {!messages.length && <div className="text-sm text-gray-500">还没有留言，抢个沙发吧。</div>}
        </div>
      </div>
    </div>
  );
}

