import Link from "next/link";

type Props = {
  tags: string[];
};

export default function TagPills({ tags }: Props) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag}`}
          className="rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:border-brand hover:-translate-y-0.5 transition transform"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}

