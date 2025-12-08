# ⚡ 快速设置管理员 - 3 种方法

## 方法 1：使用 Prisma Studio（最简单）⭐

### 步骤：

1. **在本地项目目录运行**
   ```bash
   # 先设置数据库连接（从 Vercel 获取）
   # 在 Vercel Postgres 页面，点击 ".env.local" 标签
   # 复制 POSTGRES_URL 的值
   
   # 设置环境变量
   export DATABASE_URL="你复制的POSTGRES_URL"
   
   # 运行 Prisma Studio
   npx prisma studio
   ```

2. **浏览器会自动打开**（通常是 http://localhost:5555）

3. **在 Prisma Studio 中**：
   - 左侧找到「User」表
   - 点击进入
   - 找到你的用户记录（通过邮箱查找）
   - 点击记录进入编辑模式
   - 将 `role` 字段从 `user` 改为 `admin`
   - 点击「Save」保存

**优点**：图形界面，不需要写 SQL，最简单！

---

## 方法 2：在 Prisma Data Platform 中使用 Studio

### 步骤：

1. **点击左侧导航栏的 "Studio"**
   - 在 Prisma Data Platform 页面
   - 左侧导航栏中找到 "Studio"（带显示器图标）
   - 点击进入

2. **在 Studio 中**：
   - 应该能看到数据库的表
   - 找到「User」表
   - 点击进入
   - 找到你的用户记录
   - 编辑 `role` 字段为 `admin`

---

## 方法 3：创建临时 API 路由（最快）⭐

如果以上方法都不方便，可以创建一个临时的 API 路由：

### 步骤：

1. **创建文件**：`src/app/api/admin/set-admin/route.ts`

2. **添加代码**：
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now admin`,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to update user" 
    }, { status: 500 });
  }
}
```

3. **部署后调用**：
```bash
curl -X POST https://你的域名.vercel.app/api/admin/set-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

或者在浏览器中打开：
```
https://你的域名.vercel.app/api/admin/set-admin
```
（但需要 POST 请求，所以用 curl 或 Postman）

4. **设置完成后记得删除这个文件**（安全考虑）

---

## 🎯 推荐：方法 1（Prisma Studio）

最简单、最安全、不需要写代码！

### 快速命令：

```bash
# 1. 从 Vercel 获取数据库连接字符串
# 在 Vercel Postgres 页面 → .env.local 标签 → 复制 POSTGRES_URL

# 2. 设置环境变量并运行
DATABASE_URL="你复制的连接字符串" npx prisma studio
```

然后按照上面的步骤 3 操作即可！

---

## ❓ 如果 Prisma Studio 打不开

告诉我错误信息，我会帮你解决！

