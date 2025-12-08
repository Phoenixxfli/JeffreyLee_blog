"use client";

import { useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadForm() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    if (!file) {
      setMessage("请选择要上传的文件");
      return;
    }
    setStatus("uploading");
    setMessage("");
    setPreview(null);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setStatus("success");
      setMessage("上传成功");
      setPreview(json.url);
      e.currentTarget.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message ?? "上传失败");
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-6 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">选择文件</label>
          <input
            type="file"
            name="file"
            accept="image/*,video/*,audio/*"
            className="mt-2 w-full text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={status === "uploading"}
          className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {status === "uploading" ? "上传中..." : "上传"}
        </button>
      </form>
      {message && <div className="text-sm">{message}</div>}
      {preview && (
        <div className="space-y-3 text-sm">
          <div>文件地址：{preview}</div>
          {preview.match(/\\.(mp4|webm|mov)$/i) && (
            <video src={preview} controls className="max-h-64 w-full rounded-lg" />
          )}
          {preview.match(/\\.(mp3|wav|m4a)$/i) && (
            <audio src={preview} controls className="w-full" />
          )}
          {preview.match(/\\.(png|jpe?g|gif|webp)$/i) && (
            <img src={preview} alt="uploaded" className="max-h-64 rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}

