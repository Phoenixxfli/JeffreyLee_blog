import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPostsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">创建、编辑、删除文章。</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 text-sm"
        >
          新建文章
        </Link>
      </div>

      <div className="grid gap-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/posts/${p.id}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 px-4 py-3 hover:border-brand"
          >
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">{p.title}</div>
              <div className="text-xs text-gray-500">
                {p.slug} · {p.status} · {p.tags}
              </div>
            </div>
            <div className="text-xs text-gray-500">{p.updatedAt.toISOString().slice(0, 10)}</div>
          </Link>
        ))}
        {!posts.length && <div className="text-sm text-gray-500">暂无文章</div>}
      </div>
    </div>
  );
}

