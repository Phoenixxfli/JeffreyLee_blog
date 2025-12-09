"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type PreviewItem = { name: string; url: string; type: "image" | "video" | "audio" | "file" };

export default function UploadForm() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  const hasProgress = useMemo(() => status === "uploading", [status]);

  const appendSnippet = (snippet: string) => {
    setContent((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setMessage("请选择要上传的文件");
      return;
    }
    setStatus("uploading");
    setMessage("上传中...");
    const nextPreviews: PreviewItem[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        const type = detectType(file.name);
        nextPreviews.push({ name: file.name, url: json.url, type });
        appendSnippet(buildSnippet(type, json.url, file.name));
      }
      setPreviews((prev) => [...nextPreviews, ...prev]);
      setStatus("success");
      setMessage("上传成功，已插入链接");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message ?? "上传失败");
    }
  };

  const handleLinkInsert = (type: "video" | "audio" | "image") => {
    const url = prompt(`请输入${type === "image" ? "图片" : type === "video" ? "视频" : "音频"}链接`);
    if (!url) return;
    appendSnippet(buildSnippet(type, url, type));
    setPreviews((prev) => [{ name: `${type} link`, url, type }, ...prev]);
    setMessage("已插入外链");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">创作 / 素材上传</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          类 Markdown 编辑，可随时插入图片 / 视频 / 音频（上传或外链），实时预览。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-4 lg:p-5 shadow-sm">
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 px-3 py-2 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              上传文件
            </label>
            <button
              type="button"
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 hover:border-brand"
              onClick={() => handleLinkInsert("image")}
            >
              插入图片链接
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 hover:border-brand"
              onClick={() => handleLinkInsert("video")}
            >
              插入视频链接
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 hover:border-brand"
              onClick={() => handleLinkInsert("audio")}
            >
              插入音频链接
            </button>
            {status === "uploading" && <span className="text-xs text-gray-500">上传中…</span>}
            {message && status !== "uploading" && <span className="text-xs text-gray-600 dark:text-gray-300">{message}</span>}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="这里写正文，支持 Markdown 语法。可插入：\n- 图片：![alt](url)\n- 视频：<video controls src=\"url\"></video>\n- 音频：<audio controls src=\"url\"></audio>"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-3 text-sm font-mono leading-relaxed focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-4 lg:p-5 shadow-sm">
          <div className="text-sm font-semibold">实时预览</div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <div className="text-sm text-gray-500">输入正文后，这里会实时显示效果。</div>
            )}
          </div>

          {previews.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold">素材列表</div>
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
      </div>
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

function buildSnippet(type: PreviewItem["type"], url: string, name: string) {
  if (type === "image") return `![${name}](${url})`;
  if (type === "video") return `<video controls src="${url}"></video>`;
  if (type === "audio") return `<audio controls src="${url}"></audio>`;
  return `[${name}](${url})`;
}

function PreviewContent({ item }: { item: PreviewItem }) {
  if (item.type === "video") return <video src={item.url} controls className="max-h-56 w-full rounded-lg bg-black/5" />;
  if (item.type === "audio") return <audio src={item.url} controls className="w-full" />;
  if (item.type === "image") return <img src={item.url} alt={item.name} className="max-h-56 rounded-lg" />;
  return <div className="text-xs text-gray-500">可在正文中直接引用此链接。</div>;
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

