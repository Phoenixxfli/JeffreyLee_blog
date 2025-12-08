import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { getPostFullById, updatePost, deletePost } from "@/lib/posts-db";
import { revalidatePath } from "next/cache";
import CoverField from "@/components/admin/CoverField";
import ContentWithPreview from "@/components/admin/ContentWithPreview";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const post = await getPostFullById(params.id);
  if (!post) redirect("/admin/posts");

  async function updateAction(formData: FormData) {
    "use server";
    const title = (formData.get("title") as string | null)?.trim() || "未命名";
    const slug = (formData.get("slug") as string | null)?.trim() || "";
    const date = new Date((formData.get("date") as string) || Date.now());
    const tags = (formData.get("tags") as string | null)?.trim() || "";
    const summary = (formData.get("summary") as string | null)?.trim() || "";
    const cover = (formData.get("cover") as string | null)?.trim() || "";
    const content = (formData.get("content") as string | null) || "";
    const status = (formData.get("status") as string | null) === "draft" ? "draft" : "published";
    if (!slug) throw new Error("slug 不能为空");
    await updatePost(post.id, { title, slug, date, tags, summary, cover, content, status });
    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/tags");
    revalidatePath("/blog/[slug]");
    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${post.id}`);
    redirect("/admin/posts");
  }

  async function deleteAction() {
    "use server";
    await deletePost(post.id);
    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/tags");
    revalidatePath("/blog/[slug]");
    revalidatePath("/admin/posts");
    redirect("/admin/posts");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">编辑文章</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">支持 Markdown/MDX 内容。</p>
      </div>
      <form action={updateAction} className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <TextInput name="title" label="标题" required placeholder="文章标题" defaultValue={post.title} />
        <TextInput name="slug" label="Slug" required placeholder="url-friendly-slug" defaultValue={post.slug} />
        <TextInput name="date" label="日期" type="date" defaultValue={post.date.toISOString().slice(0, 10)} />
        <TextInput name="tags" label="标签（逗号分隔）" placeholder="tag1, tag2" defaultValue={post.tags} />
        <CoverField label="封面 URL" defaultValue={post.cover || ""} />
        <TextInput name="summary" label="摘要" placeholder="一句话摘要" defaultValue={post.summary || ""} />
        <ContentWithPreview defaultValue={post.content} />
        <div className="space-y-2">
          <label className="text-sm font-semibold">状态</label>
          <select
            name="status"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            defaultValue={post.status}
          >
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand/90">
            保存
          </button>
          <form action={deleteAction}>
            <button
              type="submit"
              className="rounded-lg border border-red-300 text-red-600 px-4 py-2 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/40"
            >
              删除
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}

function TextInput({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}

