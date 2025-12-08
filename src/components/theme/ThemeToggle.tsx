"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  return (
    <button
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs hover:border-brand dark:hover:border-brand transition"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

