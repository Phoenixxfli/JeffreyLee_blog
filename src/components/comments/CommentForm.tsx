"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  postId: string;
  parentId?: string | null;
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function CommentForm({ postId, parentId, onSuccess, onCancel }: Props) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setMessage("请输入评论内容");
      return;
    }

    if (!session && !name.trim()) {
      setMessage("请输入您的名称");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          parentId: parentId || undefined,
          content: content.trim(),
          name: session?.user?.name || name.trim(),
          email: session?.user?.email || email.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "提交失败");
      }

      setContent("");
      setName("");
      setEmail("");
      setMessage(data.message || "评论已提交");
      setTimeout(() => {
        onSuccess();
        setMessage("");
      }, 1000);
    } catch (error: any) {
      setMessage(error.message || "提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {parentId && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          回复评论
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="ml-2 text-brand hover:underline"
            >
              取消
            </button>
          )}
        </div>
      )}
      
      {!session && (
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="您的名称 *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="您的邮箱（可选）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      )}

      <textarea
        placeholder={session ? "写下您的评论..." : "写下您的评论...（评论需要审核）"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        required
      />

      {message && (
        <div className={`text-sm ${message.includes("成功") || message.includes("已") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 text-sm disabled:opacity-50"
        >
          {submitting ? "提交中..." : "提交评论"}
        </button>
      </div>
    </form>
  );
}

