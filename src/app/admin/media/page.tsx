"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type MediaFile = {
  name: string;
  url: string;
  type: "image" | "video" | "audio";
  size?: number;
  uploadedAt?: string;
};

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio">("all");

  useEffect(() => {
    // 注意：这里需要实现一个 API 来获取所有上传的文件
    // 由于当前是本地存储，暂时显示提示信息
    setLoading(false);
  }, []);

  const filteredFiles = filter === "all" 
    ? files 
    : files.filter((f) => f.type === filter);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("链接已复制到剪贴板");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">媒体库</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            管理所有上传的媒体文件
          </p>
        </div>
        <Link
          href="/upload"
          className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 text-sm"
        >
          上传文件
        </Link>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "all"
              ? "bg-brand text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter("image")}
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "image"
              ? "bg-brand text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          图片
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "video"
              ? "bg-brand text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          视频
        </button>
        <button
          onClick={() => setFilter("audio")}
          className={`px-3 py-1.5 rounded text-sm ${
            filter === "audio"
              ? "bg-brand text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          音频
        </button>
      </div>

      {/* 文件列表 */}
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          <p>暂无媒体文件</p>
          <p className="mt-2 text-xs">提示：媒体库功能需要实现文件列表 API</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <div
              key={file.url}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4"
            >
              {file.type === "image" && (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              {file.type === "video" && (
                <video
                  src={file.url}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  controls
                />
              )}
              {file.type === "audio" && (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                  <audio src={file.url} controls className="w-full" />
                </div>
              )}
              <div className="space-y-2">
                <div className="text-sm font-semibold truncate">{file.name}</div>
                <div className="text-xs text-gray-500 break-all">{file.url}</div>
                <button
                  onClick={() => copyUrl(file.url)}
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  复制链接
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

