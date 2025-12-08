import UploadForm from "@/components/upload/UploadForm";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";

export default async function UploadPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) {
    redirect("/auth/signin");
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">媒体上传</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        文件将存储在本地的 public/uploads 目录（生产环境请替换为云存储）。
      </p>
      <UploadForm />
    </div>
  );
}

