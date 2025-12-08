import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { getAllPosts, getAllTags } from "@/lib/posts";
import Link from "next/link";

export default async function AdminPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const posts = await getAllPosts();
  const tags = await getAllTags();

  const storageMode = process.env.R2_BUCKET ? "Cloudflare R2" : "本地存储 (public/uploads)";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">站点后台</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          当前存储：{storageMode} · 文章 {posts.length} 篇 · 标签 {tags.length} 个
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="媒体上传" description="上传图片/音视频，生成可引用链接" href="/upload" />
        <Card title="文章管理" description="创建/编辑/删除文章" href="/admin/posts" />
        <Card title="标签与归档" description="查看标签分布，便于内容规划" href="/tags" />
        <Card title="留言管理" description="查看/删除留言" href="/admin/messages" />
        <Card title="关于编辑" description="维护 About 页面" href="/admin/about" />
        <Card title="前台主页" description="查看最新文章列表与搜索体验" href="/" />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">最近文章</h2>
        <div className="grid gap-2">
          {posts.slice(0, 6).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:border-brand"
            >
              <span>{post.title}</span>
              <span className="text-xs text-gray-500">{post.date.toLocaleDateString()}</span>
            </Link>
          ))}
          {!posts.length && <div className="text-sm text-gray-500">暂无文章</div>}
        </div>
      </section>
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-4 shadow-sm hover:border-brand"
    >
      <div className="text-base font-semibold">{title}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}

