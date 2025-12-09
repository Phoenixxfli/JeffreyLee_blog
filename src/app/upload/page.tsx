import UploadForm from "@/components/upload/UploadForm";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";

export default async function UploadPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) {
    redirect("/auth/signin");
  }
  const storageInfo = process.env.R2_BUCKET
    ? "文件将存储在 Cloudflare R2 云存储"
    : "文件将存储在本地 public/uploads 目录（建议配置 R2 云存储）";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">媒体上传</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">{storageInfo}</p>
      <UploadForm />
    </div>
  );
}

