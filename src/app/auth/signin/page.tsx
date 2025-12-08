import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "登录 | JeffreyLee Blog"
};

export default function SignInPage({
  searchParams
}: {
  searchParams: { error?: string; callbackUrl?: string };
}) {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">登录</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          使用用户名或邮箱登录
        </p>
      </div>

      {searchParams.error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {searchParams.error === "CredentialsSignin" && "用户名或密码错误"}
          {searchParams.error !== "CredentialsSignin" && searchParams.error}
        </div>
      )}

      <form
        action={async (formData) => {
          "use server";
          const username = formData.get("username") as string;
          const password = formData.get("password") as string;
          const callbackUrl = searchParams.callbackUrl || "/";

          try {
            await signIn("credentials", {
              username,
              password,
              redirectTo: callbackUrl
            });
          } catch (error) {
            redirect(`/auth/signin?error=CredentialsSignin&callbackUrl=${callbackUrl}`);
          }
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">用户名或邮箱</label>
          <input
            name="username"
            type="text"
            required
            placeholder="输入用户名或邮箱"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">密码</label>
          <input
            name="password"
            type="password"
            required
            placeholder="输入密码"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90"
        >
          登录
        </button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        还没有账号？{" "}
        <Link href="/auth/register" className="text-brand hover:underline">
          立即注册
        </Link>
      </div>
    </div>
  );
}
