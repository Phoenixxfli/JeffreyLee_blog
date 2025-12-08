import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AdminAboutPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const page = await prisma.page.findUnique({ where: { slug: "about" } });

  async function saveAction(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string | null)?.trim() || "关于本站";
    const content = (formData.get("content") as string | null)?.trim() || "";
    await prisma.page.upsert({
      where: { slug: "about" },
      create: { slug: "about", title, content },
      update: { title, content }
    });
    revalidatePath("/about");
    revalidatePath("/admin/about");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">编辑关于</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">更新“关于”页面内容，实时对前台生效。</p>
      </div>
      <form action={saveAction} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">标题</label>
          <input
            name="title"
            defaultValue={page?.title ?? "关于本站"}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">正文</label>
          <textarea
            name="content"
            defaultValue={page?.content ?? ""}
            rows={12}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90">
          保存
        </button>
      </form>
    </div>
  );
}

