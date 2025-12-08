# 🔧 修复部署错误 - 快速指南

## 问题：DATABASE_URL 未找到

这是因为：
1. ✅ Schema 已改为 PostgreSQL（已完成）
2. ❌ Vercel 环境变量还没设置

## 立即修复（2分钟）

### 步骤 1：在 Vercel 设置环境变量

1. 打开 Vercel 项目页面
2. 点击「Settings」→「Environment Variables」
3. 添加以下变量：

| 变量名 | 值 | 从哪里获取 |
|--------|-----|-----------|
| `DATABASE_URL` | `postgresql://...` | Vercel Storage → Postgres → .env.local |
| `ADMIN_EMAILS` | `你的邮箱@example.com` | 你自己填 |
| `NEXTAUTH_SECRET` | 随机字符串 | 运行 `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://你的域名.vercel.app` | Vercel 给你的地址 |

**获取 DATABASE_URL：**
1. Vercel 项目页面 → 「Storage」标签
2. 如果没有数据库，点击「Create Database」→「Postgres」
3. 创建后，点击「.env.local」标签
4. 复制 `POSTGRES_URL` 的值，粘贴到 `DATABASE_URL`

**生成 NEXTAUTH_SECRET：**
在终端运行：
```bash
openssl rand -base64 32
```
复制输出的字符串。

### 步骤 2：重新部署

1. 在 Vercel 项目页面，点击「Deployments」
2. 找到最新的部署，点击「...」→「Redeploy」
3. 等待部署完成

## ✅ 完成！

部署成功后，访问你的域名就能看到博客了。

---

## 🚀 后续更新更简单

### 方法 1：使用更新脚本（最简单）

```bash
# 在项目目录运行
./update.sh "更新了文章内容"
```

### 方法 2：手动 Git 命令

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动检测到 GitHub 的更新并重新部署。

### 方法 3：GitHub Actions（可选）

如果你想用 GitHub Actions 自动部署，需要：
1. 在 GitHub 仓库设置 → Secrets 添加：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
2. 这些值在 Vercel 项目设置 → General → Project ID 可以找到

---

## ❓ 还是失败？

1. **检查环境变量**：确保所有变量都已添加
2. **查看构建日志**：在 Vercel 部署页面查看详细错误
3. **确认数据库已创建**：Storage 标签里应该有 Postgres 数据库

