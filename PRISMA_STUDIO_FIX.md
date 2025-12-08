# 🔧 Prisma Studio 错误修复

## 问题：Prisma Studio 报错

### 原因
通常是数据库连接问题，需要设置 `DATABASE_URL` 环境变量。

---

## 解决方案

### 方法 1：设置环境变量后运行

1. **获取数据库连接字符串**
   - 打开 Vercel 项目页面
   - 点击「Storage」→ 你的 Postgres 数据库
   - 点击「.env.local」标签
   - 点击「Show secret」显示完整值
   - 复制 `POSTGRES_URL` 或 `PRISMA_DATABASE_URL` 的值

2. **设置环境变量并运行**
   ```bash
   # 设置环境变量（替换为你的实际连接字符串）
   export DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
   
   # 运行 Prisma Studio
   PATH="/opt/homebrew/bin:$PATH" npx prisma studio
   ```

---

### 方法 2：使用临时 API 路由（推荐）⭐

如果 Prisma Studio 一直有问题，可以使用我创建的临时 API：

1. **确保代码已部署**
   - 代码已包含 `/api/admin/set-admin` 路由
   - 等待 Vercel 部署完成

2. **使用 curl 调用**（在终端运行）：
   ```bash
   curl -X POST https://你的域名.vercel.app/api/admin/set-admin \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com"}'
   ```

3. **或者使用浏览器扩展**
   - 安装 "REST Client" 或 "Postman" 扩展
   - 发送 POST 请求到：`https://你的域名.vercel.app/api/admin/set-admin`
   - Body: `{"email":"your@email.com"}`

4. **设置完成后记得删除这个 API 路由**（安全考虑）

---

### 方法 3：直接在 Vercel 中查看数据库

1. **打开 Vercel 项目页面**
2. **点击「Storage」→ 你的 Postgres 数据库**
3. **查看是否有「Data」或「Tables」标签**
4. **如果有，可以直接查看和编辑数据**

---

## 快速命令（方法 1）

```bash
# 1. 从 Vercel 复制 POSTGRES_URL
# 2. 运行：
export DATABASE_URL="你复制的连接字符串"
PATH="/opt/homebrew/bin:$PATH" npx prisma studio
```

---

## 如果还是不行

告诉我：
1. 错误详情（点击 "Show details"）
2. 或者使用**方法 2**（临时 API 路由）

