"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type MediaType = "image" | "video" | "audio";

export default function UploadForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: false
      }),
      Link.configure({
        openOnClick: false
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Placeholder.configure({
        placeholder: "开始写作... 支持直接插入图片、视频、音频文件"
      })
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-4"
      }
    }
  });

  const handleFileUpload = async (file: File, type: MediaType) => {
    if (!editor) return;

    setUploading(true);
    setMessage("上传中...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();
      const url = json.url;

      // 根据类型插入到编辑器
      if (type === "image") {
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } else if (type === "video") {
        editor.chain().focus().insertContent(`<video controls src="${url}" class="max-w-full rounded-lg"></video>`).run();
      } else if (type === "audio") {
        editor.chain().focus().insertContent(`<audio controls src="${url}" class="w-full"></audio>`).run();
      }

      setMessage("上传成功，已插入");
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      setMessage(err.message ?? "上传失败");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: MediaType) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
      e.target.value = "";
    }
  };

  const insertLink = () => {
    if (!editor) return;
    const url = prompt("请输入链接地址：");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handlePublish = async (status: "published" | "draft") => {
    if (!editor) return;
    if (!title.trim() || !slug.trim()) {
      setMessage("请填写标题和 Slug");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    setSaving(true);
    setMessage("保存中...");

    try {
      const content = editor.getHTML();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("date", new Date().toISOString());
      formData.append("tags", tags);
      formData.append("summary", summary);
      formData.append("content", content);
      formData.append("status", status);

      const res = await fetch("/api/posts/create", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "保存失败");
      }

      setMessage(status === "published" ? "发布成功！" : "已保存为草稿");
      setTimeout(() => {
        router.push("/admin/posts");
      }, 1000);
    } catch (err: any) {
      setMessage(err.message ?? "保存失败");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!editor) {
    return <div className="text-center py-8">加载编辑器...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">创作 / 素材上传</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          类似 Word 的所见即所得编辑器，可直接插入图片、视频、音频文件
        </p>
      </div>

      {/* 编辑器区域 - 全宽 */}
      <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 lg:p-5 shadow-sm">
        {/* 工具栏 */}
        <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
          {/* 文本格式 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive("bold")
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive("italic")
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive("heading", { level: 1 })
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive("heading", { level: 2 })
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive("bulletList")
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            列表
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`px-3 py-1.5 rounded text-sm ${
              editor.isActive({ textAlign: "center" })
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            居中
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="px-3 py-1.5 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            链接
          </button>

          {/* 分隔线 */}
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* 媒体插入 */}
          <label className="px-3 py-1.5 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "image")}
              disabled={uploading}
            />
            插入图片
          </label>
          <label className="px-3 py-1.5 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "video")}
              disabled={uploading}
            />
            插入视频
          </label>
          <label className="px-3 py-1.5 rounded text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "audio")}
              disabled={uploading}
            />
            插入音频
          </label>
        </div>

        {/* 状态提示 */}
        {(uploading || message) && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {uploading ? "上传中..." : saving ? "保存中..." : message}
          </div>
        )}

        {/* 编辑器内容 */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
          <EditorContent editor={editor} />
        </div>

        {/* 发布按钮区域 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowPublishForm(!showPublishForm)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
          >
            {showPublishForm ? "收起" : "发布文章"}
          </button>
          {showPublishForm && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePublish("draft")}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm disabled:opacity-50"
              >
                保存草稿
              </button>
              <button
                type="button"
                onClick={() => handlePublish("published")}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand/90 text-sm disabled:opacity-50"
              >
                发布
              </button>
            </div>
          )}
        </div>

        {/* 发布表单 */}
        {showPublishForm && (
          <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
              <label className="text-sm font-semibold block mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="文章标题"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1">标签</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">摘要</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="一句话摘要"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
