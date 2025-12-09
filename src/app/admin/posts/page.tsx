"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  tags: string;
  updatedAt: string;
};

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("获取文章失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("删除失败");
      }
    } catch (error) {
      alert("删除失败");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 篇文章吗？`)) return;

    try {
      const res = await fetch("/api/admin/posts/batch", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (res.ok) {
        setSelectedIds(new Set());
        fetchPosts();
      } else {
        alert("批量删除失败");
      }
    } catch (error) {
      alert("批量删除失败");
    }
  };

  const handleBatchUpdateStatus = async (status: string) => {
    if (selectedIds.size === 0) return;

    try {
      const res = await fetch("/api/admin/posts/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), status })
      });
      if (res.ok) {
        setSelectedIds(new Set());
        fetchPosts();
      } else {
        alert("批量更新失败");
      }
    } catch (error) {
      alert("批量更新失败");
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    const filteredPosts = filterStatus === "all" 
      ? posts 
      : posts.filter((p) => p.status === filterStatus);
    
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
    }
  };

  const filteredPosts = filterStatus === "all" 
    ? posts 
    : posts.filter((p) => p.status === filterStatus);

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            创建、编辑、删除文章。共 {posts.length} 篇
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 text-sm"
        >
          新建文章
        </Link>
      </div>

      {/* 筛选和批量操作 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="all">全部</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              已选择 {selectedIds.size} 篇
            </span>
            <button
              onClick={() => handleBatchUpdateStatus("published")}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-white text-sm hover:bg-green-700"
            >
              批量发布
            </button>
            <button
              onClick={() => handleBatchUpdateStatus("draft")}
              className="rounded-lg bg-yellow-600 px-3 py-1.5 text-white text-sm hover:bg-yellow-700"
            >
              批量下架
            </button>
            <button
              onClick={handleBatchDelete}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700"
            >
              批量删除
            </button>
          </div>
        )}
      </div>

      {/* 文章列表 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            checked={filteredPosts.length > 0 && selectedIds.size === filteredPosts.length}
            onChange={toggleSelectAll}
            className="rounded"
          />
          <div className="flex-1 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <div className="col-span-5">标题</div>
            <div className="col-span-2">Slug</div>
            <div className="col-span-2">状态</div>
            <div className="col-span-2">标签</div>
            <div className="col-span-1">操作</div>
          </div>
        </div>

        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hover:border-brand"
          >
            <input
              type="checkbox"
              checked={selectedIds.has(post.id)}
              onChange={() => toggleSelect(post.id)}
              className="rounded"
            />
            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="font-semibold hover:text-brand"
                >
                  {post.title}
                </Link>
              </div>
              <div className="col-span-2 text-sm text-gray-500">{post.slug}</div>
              <div className="col-span-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {post.status === "published" ? "已发布" : "草稿"}
                </span>
              </div>
              <div className="col-span-2 text-sm text-gray-500 truncate">{post.tags}</div>
              <div className="col-span-1 flex gap-2">
                {post.status === "draft" && (
                  <Link
                    href={`/blog/${post.slug}?preview=true`}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    预览
                  </Link>
                )}
                <a
                  href={`/api/posts/${post.slug}/export?format=markdown`}
                  download
                  className="text-xs text-green-600 hover:underline"
                >
                  导出
                </a>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs text-brand hover:underline"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">暂无文章</div>
        )}
      </div>
    </div>
  );
}
