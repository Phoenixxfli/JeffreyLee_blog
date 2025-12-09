import { Metadata } from "next";
import MDXContent from "@/components/content/MDXContent";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { getCommentCountByPostId } from "@/lib/comments";
import Link from "next/link";
import CommentSection from "@/components/comments/CommentSection";
import TOC from "@/components/content/TOC";
import PostViewTracker from "@/components/posts/PostViewTracker";
import { siteConfig } from "@/config/site";

type Props = {
  params: { slug: string };
  searchParams?: { preview?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getPostBySlug(params.slug);
  if (!result) {
    return {
      title: "文章未找到",
      description: "该文章不存在或已被删除"
    };
  }

  const { post } = result;
  const title = `${post.title} | ${siteConfig.name}`;
  const description = post.summary || post.content.slice(0, 160).replace(/<[^>]*>/g, "");
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const image = post.cover || `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      locale: "zh_CN",
      type: "article",
      publishedTime: post.date.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [siteConfig.author],
      tags: post.tags ? post.tags.split(",").map((t) => t.trim()) : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    alternates: {
      canonical: url
    }
  };
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params, searchParams }: Props) {
  const result = await getPostBySlug(params.slug, searchParams?.preview === "true");
  if (!result) return null;
  const { post, content, contentType } = result;
  
  const commentCount = await getCommentCountByPostId(post.id);
  
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    date: post.date.toISOString(),
    tags: post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    summary: post.summary,
    cover: post.cover
  };

  return (
    <>
      <PostViewTracker slug={post.slug} />
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>阅读量：{post.views || 0}</span>
            <span>评论数：{commentCount}</span>
          </div>
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
          <CommentSection postId={post.id} />
        <div className="flex gap-4 text-sm">
          <Link href="/">← 返回首页</Link>
          <Link href="/tags">查看全部标签</Link>
        </div>
      </div>
        <div className="hidden lg:block">
          <TOC />
        </div>
      </div>
    </>
  );
}

