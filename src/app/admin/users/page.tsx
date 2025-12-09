import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/auth/signin");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          messages: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          管理所有注册用户，共 {users.length} 个用户
        </p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400">
          <div className="col-span-3">用户名</div>
          <div className="col-span-3">邮箱</div>
          <div className="col-span-2">角色</div>
          <div className="col-span-2">评论数</div>
          <div className="col-span-2">注册时间</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"
          >
            <div className="col-span-3">
              <div className="font-semibold">{user.username || user.name || "未设置"}</div>
            </div>
            <div className="col-span-3 text-sm text-gray-600 dark:text-gray-400">
              {user.email || "未设置"}
            </div>
            <div className="col-span-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {user.role === "admin" ? "管理员" : "用户"}
              </span>
            </div>
            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
              {user._count.comments} 条
            </div>
            <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400">
              {user.createdAt.toLocaleDateString("zh-CN")}
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">暂无用户</div>
        )}
      </div>
    </div>
  );
}

