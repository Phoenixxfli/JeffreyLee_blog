import Link from "next/link";
import TagPills from "./TagPills";
import type { PostFrontmatter } from "@/lib/posts";

type Props = {
  frontmatter: PostFrontmatter;
  excerpt?: string;
};

export default function PostCard({ frontmatter, excerpt }: Props) {
  return (
    <article className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden">
      {frontmatter.cover && (
        <div
          className="relative h-44 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${frontmatter.cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      )}
      <div className="space-y-3 px-5 py-4">
        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wide">
          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1">{frontmatter.date}</span>
          <span>· {frontmatter.readingTime ?? "约 3 分钟"}</span>
        </div>
        <Link href={`/blog/${frontmatter.slug}`} className="text-lg font-semibold leading-tight hover:text-brand">
          {frontmatter.title}
        </Link>
        {excerpt && <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{excerpt}</p>}
        <TagPills tags={frontmatter.tags || []} />
      </div>
    </article>
  );
}

