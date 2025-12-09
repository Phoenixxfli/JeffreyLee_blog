import MDXContent from "@/components/content/MDXContent";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import Link from "next/link";
import GiscusComments from "@/components/comments/GiscusComments";
import TOC from "@/components/content/TOC";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Props) {
  const result = await getPostBySlug(params.slug);
  if (!result) return null;
  const { post, content, contentType } = result;
  
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    date: post.date.toISOString(),
    tags: post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    summary: post.summary,
    cover: post.cover
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-8">
        <MDXContent frontmatter={frontmatter}>
          {contentType === "html" ? (
            <div 
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content as string }}
            />
          ) : (
            content
          )}
        </MDXContent>
        <GiscusComments />
        <div className="flex gap-4 text-sm">
          <Link href="/">← 返回首页</Link>
          <Link href="/tags">查看全部标签</Link>
        </div>
      </div>
      <div className="hidden lg:block">
        <TOC />
      </div>
    </div>
  );
}

