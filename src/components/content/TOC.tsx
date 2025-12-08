"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export default function TOC() {
  const [items, setItems] = useState<Heading[]>([]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("h1, h2, h3"));
    const parsed = nodes.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName.replace("H", ""))
    }));
    setItems(parsed);
  }, []);

  if (!items.length) return null;

  return (
    <aside className="sticky top-24 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-4 text-sm max-h-[70vh] overflow-auto">
      <div className="mb-2 font-semibold">目录</div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="truncate" style={{ paddingLeft: (item.level - 1) * 12 }}>
            <a
              href={`#${item.id}`}
              className="text-gray-700 dark:text-gray-200 hover:text-brand"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

