"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useRef, useEffect } from "react";

type MediaType = "image" | "video" | "audio";

type Props = {
  defaultValue?: string;
  name?: string;
  onChange?: (html: string) => void;
};

export default function WysiwygEditor({ defaultValue = "", name = "content", onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

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
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4"
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = html;
      }
      onChange?.(html);
    }
  });

  // 当 defaultValue 变化时更新编辑器内容
  useEffect(() => {
    if (editor && defaultValue && editor.getHTML() !== defaultValue) {
      editor.commands.setContent(defaultValue);
    }
  }, [defaultValue, editor]);

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

  if (!editor) {
    return <div className="text-center py-8">加载编辑器...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 隐藏的 input，用于表单提交 */}
      <input type="hidden" name={name} ref={hiddenInputRef} value={editor.getHTML()} />

      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
        {/* 文本格式 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm ${
            editor.isActive("bold")
              ? "bg-brand text-white"
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          居中
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="px-3 py-1.5 rounded text-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          链接
        </button>

        {/* 分隔线 */}
        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 媒体插入 */}
        <label className="px-3 py-1.5 rounded text-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
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
        <label className="px-3 py-1.5 rounded text-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
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
        <label className="px-3 py-1.5 rounded text-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
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
          {uploading ? "上传中..." : message}
        </div>
      )}

      {/* 编辑器内容 */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

