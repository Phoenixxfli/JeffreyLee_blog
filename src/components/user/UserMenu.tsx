"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const mod = await import("next-auth/react");
      const session = await mod.getSession();
      setSession(session);
    };
    load();
  }, []);

  if (!session) {
    return (
      <button
        onClick={() => signIn(undefined, { callbackUrl: "/" })}
        className="text-sm rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1 hover:border-brand"
      >
        登录
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 dark:text-gray-300">{session.user?.email}</span>
      {session.user?.isAdmin && (
        <>
          <Link
            href="/admin"
            className="rounded-md border border-brand/50 bg-brand/10 px-2 py-1 text-xs text-brand"
          >
            后台
          </Link>
          <Link
            href="/upload"
            className="rounded-md border border-brand/50 bg-brand/10 px-2 py-1 text-xs text-brand"
          >
            上传
          </Link>
        </>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs hover:border-brand"
      >
        退出
      </button>
    </div>
  );
}

