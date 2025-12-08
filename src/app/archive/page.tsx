import PostCard from "@/components/posts/PostCard";
import { getAllPosts } from "@/lib/posts";

export default async function ArchivePage() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">归档</h1>
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
            excerpt={post.summary}
          />
        ))}
      </div>
    </div>
  );
}

