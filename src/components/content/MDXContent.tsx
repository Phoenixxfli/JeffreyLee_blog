import type { ReactNode } from "react";
import TagPills from "../posts/TagPills";
import type { PostFrontmatter } from "@/lib/posts";

type Props = {
  frontmatter: PostFrontmatter;
  children: ReactNode;
};

export default function MDXContent({ frontmatter, children }: Props) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl">
      <header className="mb-6 space-y-2">
        <p className="text-sm text-gray-500">{frontmatter.date}</p>
        <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
        <TagPills tags={frontmatter.tags || []} />
      </header>
      <div className="prose-h2:scroll-mt-24 prose-h3:scroll-mt-24">{children}</div>
    </article>
  );
}

