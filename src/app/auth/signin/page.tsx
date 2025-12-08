import { signIn } from "@/auth";

export const metadata = {
  title: "登录 | 邮箱魔法链接"
};

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">登录</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">输入邮箱，收到登录链接后点击即可登录。</p>
      </div>
      <form
        action={async (formData) => {
          "use server";
          const email = formData.get("email") as string;
          await signIn("email", { email, redirectTo: "/" });
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">邮箱</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90"
        >
          发送登录链接
        </button>
      </form>
      <div className="text-xs text-gray-500">
        提示：如在本地开发环境且未配置邮箱服务，将不会真正发送邮件，请配置 .env 中的 RESEND_API_KEY 或 EMAIL_SERVER。
      </div>
    </div>
  );
}

