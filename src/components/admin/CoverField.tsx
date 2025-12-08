"use client";

import { useState } from "react";

type Props = {
  defaultValue?: string;
  label?: string;
  name?: string;
};

export default function CoverField({ defaultValue = "", label = "封面 URL", name = "cover" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onUpload = async (file?: File) => {
    if (!file) return;
    setPending(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setValue(json.url);
    } catch (e: any) {
      setError(e?.message ?? "上传失败");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex flex-col gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <div className="flex items-center gap-2 text-sm">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e.target.files?.[0] ?? undefined)}
            disabled={pending}
          />
          {pending && <span className="text-xs text-gray-500">上传中...</span>}
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        {value && (
          <div className="text-xs text-gray-500 break-all">
            已设置封面：{value}
          </div>
        )}
      </div>
    </div>
  );
}

