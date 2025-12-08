# 🚀 部署指南 - 10分钟上线你的博客

这份指南会帮你把博客部署到 Vercel，并绑定自己的域名。**完全免费，支持数据库和 API**。

---

## 📋 准备工作

你需要：
1. ✅ GitHub 账号（如果没有，去 https://github.com 注册）
2. ✅ 一个域名（如果没有，文末有免费获取方式）
3. ✅ 5-10 分钟时间

---

## 第一步：把代码放到 GitHub（3分钟）

### 1.1 创建 GitHub 仓库

1. 登录 GitHub，点击右上角「+」→「New repository」
2. 仓库名随便填，比如 `my-blog`
3. 选择 **Public**（免费账号只能用 Public）
4. **不要**勾选「Initialize this repository with a README」
5. 点击「Create repository」

### 1.2 上传代码

在终端（Terminal）运行以下命令：

```bash
# 进入项目目录
cd /Users/phoenix/codeMe/JeffreyLee_space

# 初始化 Git（如果还没初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 连接到 GitHub（把 YOUR_USERNAME 和 my-blog 改成你的）
git remote add origin https://github.com/YOUR_USERNAME/my-blog.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果提示输入账号密码：**
- 用户名：你的 GitHub 用户名
- 密码：去 https://github.com/settings/tokens 创建一个 Personal Access Token（勾选 `repo` 权限），用这个 Token 当密码

---

## 第二步：部署到 Vercel（2分钟）

### 2.1 登录 Vercel

1. 访问 https://vercel.com
2. 点击「Sign Up」，选择「Continue with GitHub」
3. 授权 Vercel 访问你的 GitHub

### 2.2 导入项目

1. 点击「Add New Project」
2. 找到你刚创建的 `my-blog` 仓库，点击「Import」
3. 直接点击「Deploy」（其他设置先不动）

等待 2-3 分钟，部署完成后会给你一个地址，比如 `my-blog-xxx.vercel.app`

---

## 第三步：配置数据库（3分钟）

### 3.1 创建 Vercel Postgres 数据库（推荐，最简单）

1. 在 Vercel 项目页面，点击顶部「Storage」标签
2. 点击「Create Database」
3. 选择「Postgres」
4. 点击「Create」
5. 创建完成后，点击「.env.local」标签，会看到自动生成的 `POSTGRES_URL`
6. 复制这个 URL

### 3.2 切换到 PostgreSQL（重要！）

**本地开发用的是 SQLite，但生产环境要用 PostgreSQL。**

在项目根目录，运行以下命令切换数据库类型：

```bash
# 备份当前的 schema.prisma
cp prisma/schema.prisma prisma/schema.sqlite.backup

# 使用 PostgreSQL 版本
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 提交更改
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

**或者手动修改：**
打开 `prisma/schema.prisma`，将第 6 行的：
```
provider = "sqlite"
```
改为：
```
provider = "postgresql"
```

### 3.3 设置环境变量

1. 在 Vercel 项目页面，点击「Settings」→「Environment Variables」
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | 刚才复制的 `POSTGRES_URL` | 数据库连接 |
| `ADMIN_EMAILS` | `你的邮箱@example.com` | 管理员邮箱 |
| `NEXTAUTH_SECRET` | 运行 `openssl rand -base64 32` 生成 | 登录密钥 |
| `NEXTAUTH_URL` | `https://my-blog-xxx.vercel.app` | 你的 Vercel 地址 |

**生成 NEXTAUTH_SECRET：**
在终端运行：
```bash
openssl rand -base64 32
```
复制输出的字符串，粘贴到环境变量。

### 3.4 运行数据库迁移

推送代码后，Vercel 会自动重新部署。部署完成后：

1. 在 Vercel 项目页面，点击「Deployments」
2. 找到最新的部署，点击进入
3. 在「Functions」标签，找到构建日志
4. 确认看到 `prisma migrate deploy` 成功执行

**如果迁移失败，手动运行：**
在本地终端运行：
```bash
# 拉取 Vercel 的环境变量
npx vercel env pull .env.local

# 运行迁移
npx prisma migrate deploy
```

---

## 第四步：绑定域名（2分钟）

### 4.1 在 Vercel 添加域名

1. 在 Vercel 项目页面，点击「Settings」→「Domains」
2. 输入你的域名（比如 `blog.example.com`）
3. 点击「Add」
4. 会显示需要添加的 DNS 记录，**先不要关闭这个页面**

### 4.2 在 Cloudflare 配置 DNS

1. 登录 Cloudflare（如果没有账号，去 https://cloudflare.com 注册，免费）
2. 添加你的网站（如果还没添加）
3. 进入「DNS」设置
4. 添加一条 **CNAME** 记录：
   - **名称**：`blog`（或 `@` 如果你要用根域名）
   - **目标**：`cname.vercel-dns.com`
   - **代理状态**：开启（橙云）或关闭（灰云）都可以
   - 点击「Save」

### 4.3 等待生效

1. 回到 Vercel，等待几分钟
2. 看到「Valid Configuration」绿色提示，说明配置成功
3. 访问你的域名，应该能看到博客了！

---

## 第五步：配置邮件发送（可选，但建议配置）

### 5.1 使用 Resend（推荐，免费额度）

1. 访问 https://resend.com 注册
2. 创建 API Key
3. 在 Vercel 环境变量中添加：
   - `RESEND_API_KEY` = 你的 API Key
   - `EMAIL_FROM` = `no-reply@你的域名.com`
4. 重新部署项目

### 5.2 或使用 SMTP

如果你有自己的邮箱服务器，添加：
- `EMAIL_SERVER` = `smtp://user:pass@smtp.example.com:587`
- `EMAIL_FROM` = `no-reply@example.com`

---

## ✅ 完成！

现在你的博客已经上线了！访问你的域名就能看到。

**后续更新博客：**
```bash
# 修改代码后
git add .
git commit -m "更新内容"
git push
```
Vercel 会自动重新部署，几分钟后就能看到更新。

---

## 🆓 免费域名获取

| 渠道 | 后缀 | 价格 | 备注 |
|------|------|------|------|
| Cloudflare | `.xyz` | ¥7/年 | 最便宜，终身同价 |
| Freenom | `.tk/.ml` | 免费 | 不太稳定，不推荐 |
| GitHub Student | `.me/.tech` | 免费 | 需要教育邮箱 |

推荐 Cloudflare，7 元一年，稳定可靠。

---

## ❓ 遇到问题？

1. **数据库连接失败**：检查 `DATABASE_URL` 是否正确
2. **登录邮件收不到**：检查邮件服务配置
3. **域名无法访问**：等待 DNS 生效（通常 5-10 分钟）
4. **部署失败**：查看 Vercel 的部署日志，通常会有错误提示

需要帮助？查看项目 README.md 或提 Issue。

