import PostCard from "@/components/posts/PostCard";
import SearchBox from "@/components/search/SearchBox";
import { getAllPosts, getAllTags } from "@/lib/posts";
import Link from "next/link";
import { auth } from "@/auth";
import { ReactNode } from "react";

export default async function HomePage() {
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const featured = posts[0];
  const rest = posts.slice(1);
  const navItems = [
    { title: "全部文章", desc: "按时间归档浏览", href: "/archive", icon: "🗂️" },
    { title: "标签导航", desc: "按主题快速切换", href: "/tags", icon: "🏷️" },
    ...(isAdmin ? [{ title: "媒体上传", desc: "管理员上传多媒体", href: "/upload", icon: "⬆️" }] : [])
  ];
  return (
    <div className="space-y-14">
      <Section>
        <SectionHeader title="导航" />
        <div className="grid gap-3 md:grid-cols-3">
          {navItems.map((item) => (
            <GlassNavCard key={item.href} {...item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.65fr,1fr]">
          <div className="space-y-6">
            {featured && (
              <ContentCard title="精选推荐">
                <PostCard frontmatter={featured.frontmatter} excerpt={featured.frontmatter.summary || featured.excerpt} />
              </ContentCard>
            )}
            <ContentCard
              title="最新文章"
              action={
                <Link href="/archive" className="text-sm text-brand hover:underline">
                  全部 →
                </Link>
              }
            >
              <div className="space-y-4">
                {rest.map((post) => (
                  <PostCard
                    key={post.slug}
                    frontmatter={{
                      title: post.title,
                      slug: post.slug,
                      date: post.date.toISOString(),
                      tags: post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                      summary: post.summary,
                      cover: post.cover
                    }}
                    excerpt={post.summary}
                  />
                ))}
                {!rest.length && featured && <div className="text-sm text-gray-500">暂无更多文章，快去创作一篇吧。</div>}
              </div>
            </ContentCard>
          </div>

          <div className="space-y-6">
            <SidebarCard title="关于">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                这里记录创作、技术与思考。支持多媒体内容与评论，管理员登录后可上传媒体、维护站点。
              </p>
              <div className="mt-2 text-xs text-gray-500">邮箱登录可进入后台。</div>
            </SidebarCard>

            <SidebarCard title="搜索">
              <SearchBox
                items={posts.map((p) => ({
                  title: p.frontmatter.title,
                  slug: p.frontmatter.slug,
                  summary: p.frontmatter.summary,
                  tags: p.frontmatter.tags
                }))}
              />
            </SidebarCard>

            <SidebarCard title="标签">
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 20).map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tags/${t.tag}`}
                    className="rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 px-3 py-1 text-xs hover:border-brand"
                  >
                    #{t.tag} ({t.count})
                  </Link>
                ))}
                {!tags.length && <div className="text-xs text-gray-500">暂无标签</div>}
              </div>
            </SidebarCard>

            <SidebarCard title="功能速览">
              <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>Markdown / MDX 写作，代码高亮</li>
                <li>图片 / 音频 / 视频 上传与引用</li>
                <li>邮箱魔法链接登录，后台受保护</li>
                <li>giscus 评论，RSS / sitemap / robots</li>
              </ul>
            </SidebarCard>
          </div>
        </div>
      </Section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-white/80">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/15 px-3 py-1">{children}</span>;
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
      <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</div>
      {children}
    </div>
  );
}

function GlassNavCard({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm px-4 py-3 flex items-center gap-3 hover:-translate-y-1 transition transform text-sm text-gray-900 dark:text-gray-100"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-lg">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="text-base font-semibold">{title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{desc}</div>
      </div>
    </Link>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <div className="px-2 sm:px-0 space-y-4">{children}</div>;
}

function SectionHeader({ title }: { title: string }) {
  return <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</div>;
}

function ContentCard({
  title,
  action,
  children
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

