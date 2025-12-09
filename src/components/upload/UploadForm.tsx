"use client";

import { useMemo, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type PreviewItem = { name: string; url: string; type: "image" | "video" | "audio" | "file" };

export default function UploadForm() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  const hasProgress = useMemo(() => status === "uploading", [status]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const files = Array.from(formData.getAll("files")).filter(Boolean) as File[];
    const videoUrl = (formData.get("videoUrl") as string)?.trim();
    const audioUrl = (formData.get("audioUrl") as string)?.trim();

    if (!files.length && !videoUrl && !audioUrl) {
      setMessage("请至少上传一个文件或填写视频/音频链接");
      return;
    }

    setStatus("uploading");
    setMessage("");
    setPreviews([]);
    const nextPreviews: PreviewItem[] = [];

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        nextPreviews.push({ name: file.name, url: json.url, type: detectType(file.name) });
      }

      if (videoUrl) nextPreviews.push({ name: "视频链接", url: videoUrl, type: "video" });
      if (audioUrl) nextPreviews.push({ name: "音频链接", url: audioUrl, type: "audio" });

      setPreviews(nextPreviews);
      setStatus("success");
      setMessage("已生成可引用链接");
      e.currentTarget.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message ?? "上传失败");
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">组合上传</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          支持图片 / 视频 / 音频 / 外链，生成可直接引用的链接。
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">标题</label>
            <input
              name="title"
              placeholder="用于区分本次上传的内容"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">标签（逗号分隔）</label>
            <input
              name="tags"
              placeholder="image, video, cover"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">描述</label>
          <textarea
            name="description"
            rows={3}
            placeholder="本次素材的用途/备注"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">上传文件（可多选）</label>
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 p-4 text-sm">
            <input
              type="file"
              name="files"
              multiple
              accept="image/*,video/*,audio/*"
              className="w-full text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">支持图片 / 视频 / 音频，多个文件可同时上传</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">视频外链（可选）</label>
            <input
              name="videoUrl"
              placeholder="如 B 站、YouTube 外链，或已上传的视频地址"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">音频外链（可选）</label>
            <input
              name="audioUrl"
              placeholder="如音乐/播客外链，或已上传的音频地址"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={hasProgress}
            className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 disabled:opacity-60"
          >
            {status === "uploading" ? "上传中..." : "生成可引用链接"}
          </button>
          {message && <span className="text-sm text-gray-700 dark:text-gray-300">{message}</span>}
        </div>
      </form>

      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold">结果预览</div>
          <div className="grid gap-3 md:grid-cols-2">
            {previews.map((p) => (
              <div
                key={p.url + p.name}
                className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 space-y-2 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium truncate">{p.name}</span>
                  <CopyButton text={p.url} />
                </div>
                <div className="text-xs break-all text-gray-600 dark:text-gray-400">{p.url}</div>
                <PreviewContent item={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function detectType(filename: string): PreviewItem["type"] {
  const lower = filename.toLowerCase();
  if (/\.(mp4|webm|mov)$/i.test(lower)) return "video";
  if (/\.(mp3|wav|m4a)$/i.test(lower)) return "audio";
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(lower)) return "image";
  return "file";
}

function PreviewContent({ item }: { item: PreviewItem }) {
  if (item.type === "video") return <video src={item.url} controls className="max-h-56 w-full rounded-lg bg-black/5" />;
  if (item.type === "audio") return <audio src={item.url} controls className="w-full" />;
  if (item.type === "image") return <img src={item.url} alt={item.name} className="max-h-56 rounded-lg" />;
  return <div className="text-xs text-gray-500">可在文章或页面中直接引用此链接。</div>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="text-xs rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 hover:border-brand"
    >
      {copied ? "已复制" : "复制链接"}
    </button>
  );
}

