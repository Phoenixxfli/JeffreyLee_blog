# Phoenix Blog - 个人博客系统

现代化的个人博客网站，支持文章管理、留言板、媒体上传等功能。

## 功能特性

- ✨ 现代化 UI 设计，支持暗色模式
- 📝 在线文章编辑（Markdown/MDX）
- 💬 留言板功能
- 📤 媒体上传（图片/视频/音频）
- 🔐 邮箱魔法链接登录
- 👥 双角色权限管理（管理员/访客）
- 🏷️ 标签分类与归档
- 🔍 全文搜索
- 📱 响应式设计

## 本地开发

```bash
# 安装依赖
npm install --legacy-peer-deps

# 配置环境变量（复制 env.example 为 .env.local）
cp env.example .env.local

# 初始化数据库
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 第一步：准备代码仓库

1. 在 GitHub 创建一个新仓库（名字随意，如 `my-blog`）
2. 将代码推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/my-blog.git
git push -u origin main
```

### 第二步：在 Vercel 部署

1. 访问 https://vercel.com，用 GitHub 账号登录
2. 点击「Add New Project」
3. 选择你刚创建的仓库
4. 点击「Deploy」

### 第三步：配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

**必须配置：**
- `DATABASE_URL` - 数据库连接（见下方数据库设置）
- `ADMIN_EMAILS` - 管理员邮箱，逗号分隔，如：`admin@example.com`
- `NEXTAUTH_SECRET` - 随机字符串（可用 `openssl rand -base64 32` 生成）
- `NEXTAUTH_URL` - 你的网站地址，如：`https://yourdomain.com`

**邮件配置（二选一）：**
- `RESEND_API_KEY` + `EMAIL_FROM`（推荐）
- 或 `EMAIL_SERVER` + `EMAIL_FROM`

**可选配置：**
- `R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY` 等（如果使用 Cloudflare R2）
- `NEXT_PUBLIC_GISCUS_*`（如果使用 Giscus 评论）

### 第四步：设置数据库

Vercel 支持多种数据库，推荐：

**方案 A：Vercel Postgres（最简单）**
1. 在 Vercel 项目页面，点击「Storage」→「Create Database」→ 选择「Postgres」
2. 创建后会自动生成 `DATABASE_URL`，复制到环境变量

**方案 B：PlanetScale（免费 MySQL）**
1. 访问 https://planetscale.com 注册
2. 创建数据库，获取连接字符串
3. 修改 `prisma/schema.prisma` 的 `provider` 为 `mysql`
4. 将连接字符串填入 `DATABASE_URL`

**方案 C：Supabase（免费 PostgreSQL）**
1. 访问 https://supabase.com 注册
2. 创建项目，获取连接字符串
3. 修改 `prisma/schema.prisma` 的 `provider` 为 `postgresql`
4. 将连接字符串填入 `DATABASE_URL`

**重要：** 部署后需要运行一次数据库迁移：
- 在 Vercel 项目设置 → 「Deployments」→ 找到最新部署 → 「Functions」→ 运行 `npx prisma migrate deploy`

### 第五步：绑定自定义域名

1. 在 Vercel 项目页面，点击「Settings」→「Domains」
2. 输入你的域名（如 `blog.example.com`）
3. 按照提示添加 DNS 记录（见下方 Cloudflare 配置）

## Cloudflare DNS 配置

如果你使用 Cloudflare 管理域名：

1. 登录 Cloudflare，选择你的域名
2. 进入「DNS」设置
3. 添加一条 **CNAME** 记录：
   - **名称**：`@` 或 `blog`（根据你的子域名）
   - **目标**：`cname.vercel-dns.com`
   - **代理状态**：开启（橙云）或关闭（灰云）都可以
4. 保存后等待几分钟，DNS 生效

**注意：** Vercel 会自动处理 HTTPS 证书，无需手动配置。

## 常见问题

### 数据库迁移失败
确保在 Vercel 环境变量中设置了正确的 `DATABASE_URL`，并在部署后运行迁移命令。

### 登录邮件收不到
检查 `RESEND_API_KEY` 或 `EMAIL_SERVER` 配置是否正确。

### 上传文件失败
如果使用本地存储，确保 `public/uploads` 目录存在。生产环境建议使用 Cloudflare R2 或 Supabase Storage。

## 技术栈

- Next.js 14
- TypeScript
- Prisma
- NextAuth.js
- Tailwind CSS
- SQLite/PostgreSQL/MySQL

## 许可证

MIT

