"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

export default function PostViewTracker({ slug }: Props) {
  useEffect(() => {
    // 记录阅读量
    fetch(`/api/posts/${slug}/view`, {
      method: "POST"
    }).catch(() => {
      // 静默失败
    });
  }, [slug]);

  return null;
}

