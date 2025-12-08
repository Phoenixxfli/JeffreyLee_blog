import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export default async function TagsPage() {
  const tags = await getAllTags();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">标签</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map((item) => (
          <Link
            key={item.tag}
            href={`/tags/${item.tag}`}
            className="rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm hover:border-brand"
          >
            #{item.tag} ({item.count})
          </Link>
        ))}
        {!tags.length && <div className="text-gray-500 text-sm">还没有标签</div>}
      </div>
    </div>
  );
}

