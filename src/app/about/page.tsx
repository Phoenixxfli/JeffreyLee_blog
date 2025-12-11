import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });
  const title = page?.title ?? "关于本站";
  const content = page?.content ?? "";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="whitespace-pre-wrap leading-7 text-gray-800 dark:text-gray-200">
        {content}
      </div>
    </div>
  );
}

