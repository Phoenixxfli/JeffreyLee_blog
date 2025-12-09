import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import Link from "next/link";

export default async function AdminTagsPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理所有标签，共 {tags.length} 个标签
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 hover:border-brand"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{tag}</span>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {count} 篇
              </span>
            </div>
          </Link>
        ))}
        {tags.length === 0 && <div className="text-sm text-gray-500 col-span-full">暂无标签</div>}
      </div>
    </div>
  );
}

