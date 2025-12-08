import PostCard from "@/components/posts/PostCard";
import { getPostsByTag } from "@/lib/posts";

type Props = {
  params: { tag: string };
};

export default async function TagDetailPage({ params }: Props) {
  const posts = await getPostsByTag(params.tag);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">标签：{params.tag}</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
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
            excerpt={post.summary ?? undefined}
          />
        ))}
        {!posts.length && <div className="text-sm text-gray-500">没有相关文章</div>}
      </div>
    </div>
  );
}

