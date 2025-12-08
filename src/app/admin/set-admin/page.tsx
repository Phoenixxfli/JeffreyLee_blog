"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setResult(data);
      
      if (data.success) {
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (error: any) {
      setResult({ error: error.message || "请求失败" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">设置管理员</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          输入已注册用户的邮箱，将其设置为管理员
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? "设置中..." : "设置为管理员"}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            result.success
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}
        >
          {result.success ? (
            <div>
              <p className="font-semibold">✅ 成功！</p>
              <p>{result.message}</p>
              <p className="mt-2 text-xs">2 秒后跳转到登录页面...</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold">❌ 失败</p>
              <p>{result.error}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500">
        ⚠️ 注意：此页面仅用于一次性设置管理员，使用后建议删除此页面。
      </div>
    </div>
  );
}

