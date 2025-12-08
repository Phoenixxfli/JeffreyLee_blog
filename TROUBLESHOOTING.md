# 🔧 故障排查指南

## 登录页面出现 "Server error" 的解决方案

### 1. 检查环境变量

在 Vercel 项目页面 → Settings → Environment Variables，确保以下变量已设置：

#### 必须设置：
- ✅ `DATABASE_URL` - PostgreSQL 连接字符串
- ✅ `NEXTAUTH_SECRET` - 登录密钥（**必须设置，不能为空**）

#### 可选设置：
- `ADMIN_EMAILS` - 管理员邮箱列表（逗号分隔）

### 2. 生成 NEXTAUTH_SECRET

如果 `NEXTAUTH_SECRET` 未设置或为空，会导致服务器错误。

**生成方法**：
```bash
openssl rand -base64 32
```

**在 Vercel 设置**：
1. 复制生成的字符串
2. 在 Vercel 环境变量中添加 `NEXTAUTH_SECRET`
3. 值填写生成的字符串
4. 重新部署

### 3. 检查数据库连接

确保 `DATABASE_URL` 正确：
- 格式：`postgresql://user:password@host:5432/database?sslmode=require`
- 在 Vercel Storage → Postgres → .env.local 中获取

### 4. 查看详细错误日志

1. 打开 Vercel 项目页面
2. 点击「Deployments」
3. 找到最新的部署
4. 点击「Functions」或「Runtime Logs」
5. 查看具体错误信息

### 5. 常见错误及解决方案

#### 错误：`MissingSecret: Please define a secret`
**原因**：`NEXTAUTH_SECRET` 未设置
**解决**：按照步骤 2 生成并设置

#### 错误：`PrismaClientInitializationError`
**原因**：数据库连接失败
**解决**：检查 `DATABASE_URL` 是否正确

#### 错误：`TypeError: Cannot read property 'xxx' of undefined`
**原因**：代码逻辑错误
**解决**：查看 Runtime Logs 中的详细错误，告诉我具体错误信息

---

## 快速检查清单

- [ ] `DATABASE_URL` 已设置且格式正确
- [ ] `NEXTAUTH_SECRET` 已设置且不为空
- [ ] `ADMIN_EMAILS` 已设置（如果需要管理员功能）
- [ ] 数据库已创建并运行
- [ ] 最新代码已部署

---

## 如果问题仍然存在

1. **查看 Vercel 日志**：找到具体的错误信息
2. **告诉我错误详情**：把错误信息发给我
3. **检查代码版本**：确保最新代码已部署

