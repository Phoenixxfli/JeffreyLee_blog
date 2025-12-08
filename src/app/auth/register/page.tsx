"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "注册失败");
        setLoading(false);
        return;
      }

      // 注册成功，跳转到登录页
      router.push("/auth/signin?registered=true");
    } catch (err) {
      setError("注册失败，请稍后重试");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">注册</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          创建你的账号，开始使用博客
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            用户名 <span className="text-red-500">*</span>
          </label>
          <input
            name="username"
            type="text"
            required
            minLength={3}
            placeholder="至少 3 个字符"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">昵称（可选）</label>
          <input
            name="name"
            type="text"
            placeholder="显示名称"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            密码 <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="至少 6 个字符"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? "注册中..." : "注册"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        已有账号？{" "}
        <Link href="/auth/signin" className="text-brand hover:underline">
          立即登录
        </Link>
      </div>
    </div>
  );
}

