"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function GiscusComments() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="mt-8">
      <Giscus
        id="comments"
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO || ""}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General"}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="zh-CN"
      />
    </div>
  );
}

