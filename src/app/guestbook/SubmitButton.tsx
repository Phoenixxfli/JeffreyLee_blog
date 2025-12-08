"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90 disabled:opacity-60"
    >
      {pending ? "提交中..." : "提交留言"}
    </button>
  );
}

