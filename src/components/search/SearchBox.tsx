"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import Link from "next/link";

type Item = {
  title: string;
  slug: string;
  tags?: string[];
  summary?: string;
};

type Props = {
  items: Item[];
};

export default function SearchBox({ items }: Props) {
  const [query, setQuery] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "summary", "tags"],
        threshold: 0.35
      }),
    [items]
  );

  const results = query ? fuse.search(query).map((r) => r.item) : items.slice(0, 6);

  return (
    <div className="w-full space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章标题、摘要或标签"
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      <div className="grid gap-2">
        {results.map((item) => (
          <Link
            key={item.slug}
            href={`/blog/${item.slug}`}
            className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:border-brand"
          >
            <span>{item.title}</span>
            <span className="text-xs text-gray-500">{item.tags?.slice(0, 2).join(", ")}</span>
          </Link>
        ))}
        {!results.length && <div className="text-xs text-gray-500">未找到匹配内容</div>}
      </div>
    </div>
  );
}

