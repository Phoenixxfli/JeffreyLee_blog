import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const postsPromise = getAllPosts();
  // In App Router sitemap must be async if we await
  // but keep signature sync by returning Promise here
  // Next.js will handle it.
  // @ts-expect-error async sitemap
  return postsPromise.then((posts) => [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date()
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date)
    }))
  ]);
}

