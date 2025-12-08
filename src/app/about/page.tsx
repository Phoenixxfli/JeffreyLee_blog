import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });
  const title = page?.title ?? "关于本站";
  const content =
    page?.content ??
    "这里记录创作、技术与思考。管理员可在后台编辑本页内容，支持图文多媒体嵌入。";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="whitespace-pre-wrap leading-7 text-gray-800 dark:text-gray-200">
        {content}
      </div>
    </div>
  );
}

