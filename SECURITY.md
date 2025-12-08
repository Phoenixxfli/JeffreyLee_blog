# 🔒 安全说明

## 管理员权限管理

### ⚠️ 重要安全修复

**问题**：之前如果注册时邮箱匹配 `ADMIN_EMAILS`，会自动成为管理员，存在安全风险。

**修复**：
- ✅ **注册时不会自动成为管理员**：所有新注册用户都是普通用户（`role: "user"`）
- ✅ **只有数据库中明确标记为 `admin` 的用户才是管理员**
- ✅ **`ADMIN_EMAILS` 仅用于标识，不会自动赋予权限**

### 如何设置管理员？

#### 方法 1：直接修改数据库（推荐）⭐

在 Vercel Postgres 数据库中运行：

```sql
-- 将指定用户设置为管理员
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

#### 方法 2：使用 Prisma Studio（开发环境）

```bash
npx prisma studio
```

在 Prisma Studio 中：
1. 找到你的用户
2. 将 `role` 字段改为 `admin`
3. 保存

#### 方法 3：创建管理员账号的 SQL 脚本

如果你有数据库访问权限，可以创建一个初始化脚本：

```sql
-- 创建管理员账号（如果不存在）
INSERT INTO "User" (id, username, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin-id-here',
  'admin',
  'your@email.com',
  '$2a$10$hashed_password_here', -- 使用 bcrypt 加密的密码
  'Admin',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```

### 安全最佳实践

1. **不要公开管理员邮箱**
   - `ADMIN_EMAILS` 是环境变量，不要提交到 Git
   - 不要在代码中硬编码管理员邮箱

2. **使用强密码**
   - 管理员账号必须使用强密码
   - 建议使用密码管理器生成

3. **定期检查管理员列表**
   - 定期检查数据库中的管理员账号
   - 移除不需要的管理员权限

4. **限制管理员数量**
   - 只给真正需要的人管理员权限
   - 使用最小权限原则

### 验证管理员权限

登录后检查：
- 如果看到「后台」和「上传」按钮 → 是管理员
- 如果只看到「退出」按钮 → 不是管理员

### 常见问题

**Q: 我注册了管理员邮箱，为什么还不是管理员？**
A: 这是安全设计。注册后需要手动在数据库中设置 `role = 'admin'`。

**Q: 如何知道我的账号是否是管理员？**
A: 登录后查看是否有「后台」和「上传」按钮，或者检查数据库中的 `role` 字段。

**Q: 可以批量设置管理员吗？**
A: 可以，在数据库中运行：
```sql
UPDATE "User" SET role = 'admin' WHERE email IN ('email1@example.com', 'email2@example.com');
```

---

## 总结

- ✅ 注册时不会自动成为管理员（安全）
- ✅ 只有数据库中 `role = 'admin'` 的用户才是管理员
- ✅ `ADMIN_EMAILS` 仅用于标识，不影响权限
- ✅ 需要手动在数据库中设置管理员权限

