"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";

type Props = {
  defaultValue?: string;
};

export default function ContentWithPreview({ defaultValue = "" }: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-semibold">内容（Markdown/MDX 简易预览）</label>
        <textarea
          name="content"
          rows={16}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">预览</div>
        <div className="prose prose-sm max-w-none rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-3 overflow-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrism]}>
            {value || "（这里显示预览，输入内容即可）"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

