# 🔧 登录错误排查指南

## 问题：点击登录后出现 "Server error"

### 快速检查清单

#### 1. 检查环境变量（最重要）⭐

在 Vercel 项目页面 → Settings → Environment Variables，确保：

- ✅ **`NEXTAUTH_SECRET`** - **必须设置！**
  - 如果未设置，运行：`openssl rand -base64 32`
  - 复制生成的字符串，添加到 Vercel 环境变量
  - **这是最常见的错误原因**

- ✅ **`DATABASE_URL`** - 数据库连接字符串
  - 格式：`postgresql://user:pass@host:5432/dbname?sslmode=require`
  - 在 Vercel Storage → Postgres → .env.local 中获取

- ✅ **`ADMIN_EMAILS`** - 管理员邮箱（可选）
  - 格式：`your@email.com` 或 `email1@example.com,email2@example.com`

#### 2. 查看详细错误日志

1. 打开 Vercel 项目页面
2. 点击「Deployments」
3. 找到最新的部署
4. 点击「Functions」标签
5. 找到 `/api/auth/[...nextauth]` 函数
6. 查看「Runtime Logs」
7. **复制具体的错误信息**

### 常见错误及解决方案

#### 错误 1：`MissingSecret: Please define a secret`
**原因**：`NEXTAUTH_SECRET` 未设置
**解决**：
```bash
# 生成密钥
openssl rand -base64 32

# 在 Vercel 环境变量中添加
NEXTAUTH_SECRET=生成的字符串
```

#### 错误 2：`PrismaClientInitializationError`
**原因**：数据库连接失败
**解决**：
- 检查 `DATABASE_URL` 是否正确
- 确认数据库已创建并运行
- 检查网络连接

#### 错误 3：`TypeError: Cannot read property 'xxx' of undefined`
**原因**：代码逻辑错误
**解决**：查看 Runtime Logs 中的详细错误，告诉我具体错误信息

### 测试步骤

1. **检查环境变量**：
   ```bash
   # 在 Vercel 项目页面检查
   Settings → Environment Variables
   ```

2. **重新部署**：
   - 在 Vercel 项目页面
   - 点击「Deployments」
   - 找到最新部署 → 「...」→ 「Redeploy」

3. **测试登录**：
   - 访问 `/auth/signin`
   - 输入用户名和密码
   - 点击登录
   - 查看是否还有错误

### 如果问题仍然存在

请提供以下信息：

1. **Vercel Runtime Logs 中的具体错误信息**
   - 路径：Deployments → Functions → Runtime Logs
   - 复制完整的错误堆栈

2. **环境变量检查结果**
   - `NEXTAUTH_SECRET` 是否已设置？
   - `DATABASE_URL` 是否正确？

3. **浏览器控制台错误**（如果有）
   - 按 F12 打开开发者工具
   - 查看 Console 标签中的错误

---

## 临时解决方案

如果急需登录，可以尝试：

1. **确保所有环境变量已设置**
2. **重新部署**（在 Vercel 点击 Redeploy）
3. **清除浏览器缓存**后重试

---

## 联系支持

如果以上方法都无法解决，请把：
- Vercel Runtime Logs 的完整错误信息
- 环境变量检查结果（隐藏敏感信息）

发给我，我会继续帮你修复。

