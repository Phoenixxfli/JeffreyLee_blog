# 👤 管理员设置完整指南

## 重要说明

**管理员账号需要先注册，然后才能在数据库中设置为管理员。**

不能直接在数据库中创建管理员账号（因为没有密码），必须通过注册流程创建账号。

---

## 📋 完整设置流程

### 第一步：注册账号

1. **访问注册页面**
   - 打开：`https://你的域名.vercel.app/auth/register`
   - 或本地：`http://localhost:3000/auth/register`

2. **填写注册信息**
   - **用户名**：至少 3 个字符（例如：`JeffreyLee`）
   - **邮箱**：你的邮箱地址（例如：`your@email.com`）
   - **昵称**（可选）：显示名称
   - **密码**：至少 6 个字符

3. **点击"注册"**
   - 注册成功后会自动跳转到登录页面

### 第二步：在数据库中设置为管理员

#### 方法 A：使用 Vercel Postgres（推荐）

1. **打开 Vercel 项目页面**
   - 登录 Vercel
   - 进入你的项目

2. **打开数据库**
   - 点击「Storage」标签
   - 找到你的 Postgres 数据库
   - 点击进入

3. **运行 SQL 命令**
   - 点击「SQL Editor」或「Query」
   - 运行以下 SQL：

```sql
UPDATE "User" 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

**注意**：把 `your@email.com` 替换成你注册时使用的邮箱。

4. **验证**
   - 运行查询确认：
```sql
SELECT id, username, email, role 
FROM "User" 
WHERE email = 'your@email.com';
```

应该看到 `role` 字段是 `admin`。

#### 方法 B：使用 Prisma Studio（本地开发）

```bash
# 在项目目录运行
npx prisma studio
```

1. 浏览器会自动打开 Prisma Studio
2. 找到「User」表
3. 找到你的用户记录
4. 点击编辑，将 `role` 字段改为 `admin`
5. 保存

### 第三步：登录验证

1. **访问登录页面**
   - 打开：`https://你的域名.vercel.app/auth/signin`
   - 或本地：`http://localhost:3000/auth/signin`

2. **使用注册时的账号登录**
   - 用户名或邮箱：你注册时填写的
   - 密码：你注册时设置的密码

3. **验证管理员权限**
   - ✅ 如果看到「后台」和「上传」按钮 → 成功！
   - ❌ 如果只看到「退出」按钮 → 检查数据库中的 `role` 字段

---

## 🔍 常见问题

### Q: 我直接在数据库中创建用户可以吗？

**A: 不可以！** 因为：
- 密码是使用 bcrypt 加密的，不能直接写入
- 必须通过注册流程创建密码哈希

### Q: 我已经注册了，但还不是管理员怎么办？

**A: 按照第二步操作**：
1. 在数据库中运行 `UPDATE "User" SET role = 'admin' WHERE email = '你的邮箱';`
2. 退出登录后重新登录
3. 应该就能看到管理员按钮了

### Q: 如何检查我的账号是否是管理员？

**方法 1：登录后查看**
- 看到「后台」和「上传」按钮 → 是管理员
- 只看到「退出」按钮 → 不是管理员

**方法 2：查看数据库**
```sql
SELECT email, role FROM "User" WHERE email = 'your@email.com';
```
如果 `role` 是 `admin`，就是管理员。

### Q: 可以设置多个管理员吗？

**A: 可以！** 运行：

```sql
UPDATE "User" 
SET role = 'admin' 
WHERE email IN ('admin1@example.com', 'admin2@example.com', 'admin3@example.com');
```

### Q: 如何移除管理员权限？

**A: 运行：**

```sql
UPDATE "User" 
SET role = 'user' 
WHERE email = 'your@email.com';
```

---

## 📝 快速检查清单

- [ ] 已注册账号（有用户名、邮箱、密码）
- [ ] 在数据库中设置了 `role = 'admin'`
- [ ] 退出登录后重新登录
- [ ] 能看到「后台」和「上传」按钮

---

## 🎯 总结

1. **先注册** → 创建账号和密码
2. **再设置** → 在数据库中更新 `role = 'admin'`
3. **重新登录** → 验证管理员权限

**不能跳过注册步骤！** 密码必须通过注册流程创建。

