# 👤 管理员设置指南

## 如何识别管理员？

系统通过以下方式识别管理员：

### 1. 数据库中的 `role` 字段（优先）
- 如果用户的 `role` 字段是 `"admin"`，则自动成为管理员
- 这是最可靠的方式

### 2. `ADMIN_EMAILS` 环境变量（备用）
- 如果用户的邮箱在 `ADMIN_EMAILS` 列表中，也会被识别为管理员
- 登录时会自动将数据库中的 `role` 更新为 `"admin"`

## 设置管理员的方法

### 方法 1：通过环境变量（推荐）⭐

1. **在 Vercel 设置环境变量**：
   - 打开 Vercel 项目页面
   - 点击「Settings」→「Environment Variables」
   - 添加 `ADMIN_EMAILS`，值为你的邮箱（多个邮箱用逗号分隔）
   - 例如：`your@email.com,another@email.com`

2. **注册账号**：
   - 访问 `/auth/register`
   - 使用在 `ADMIN_EMAILS` 中的邮箱注册
   - 登录后会自动成为管理员

3. **验证**：
   - 登录后应该能看到「后台」和「上传」按钮
   - 可以访问 `/admin` 和 `/upload` 页面

### 方法 2：直接修改数据库

如果你已经有账号，可以直接在数据库中修改：

```sql
-- 在 Vercel Postgres 中运行
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

## 管理员权限

管理员可以：
- ✅ 访问 `/admin` 后台管理页面
- ✅ 访问 `/upload` 媒体上传页面
- ✅ 创建、编辑、删除文章
- ✅ 管理留言板
- ✅ 编辑"关于"页面

普通用户只能：
- ✅ 浏览文章
- ✅ 留言
- ✅ 注册和登录

## 权限检查逻辑

### 前端显示
- **Header 导航**：上传按钮不在导航栏中，只在 UserMenu 中显示（仅管理员可见）
- **UserMenu**：只有 `session.user.isAdmin === true` 时才显示「后台」和「上传」按钮

### 后端保护
- **Middleware**：`/admin` 和 `/upload` 路由受保护，非管理员会被重定向到登录页
- **Server Actions**：所有管理操作都会检查 `isAdmin` 权限

## 常见问题

### Q: 为什么我设置了 ADMIN_EMAILS 但还是不是管理员？
A: 检查以下几点：
1. 邮箱是否完全匹配（大小写不敏感）
2. 是否已经登录（需要重新登录才能更新 session）
3. 查看浏览器控制台是否有错误
4. 检查 Vercel 环境变量是否已部署

### Q: 如何查看当前登录用户是否是管理员？
A: 登录后：
- 如果看到「后台」和「上传」按钮 → 是管理员
- 如果只看到「退出」按钮 → 不是管理员

### Q: 可以设置多个管理员吗？
A: 可以！在 `ADMIN_EMAILS` 中用逗号分隔多个邮箱：
```
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
```

## 安全提示

⚠️ **重要**：
- `ADMIN_EMAILS` 是敏感信息，不要提交到 Git
- 定期检查管理员列表，移除不需要的管理员
- 使用强密码保护管理员账号

