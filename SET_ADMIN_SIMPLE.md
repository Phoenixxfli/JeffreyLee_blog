# ⚡ 最简单的方法：使用 API 设置管理员

## 步骤（3 步完成）

### 第一步：确保已注册账号
1. 访问：`https://你的域名.vercel.app/auth/register`
2. 注册你的账号（记住邮箱和密码）

### 第二步：等待代码部署
- 代码已包含 `/api/admin/set-admin` 路由
- 等待 Vercel 部署完成（约 2-3 分钟）

### 第三步：调用 API 设置管理员

#### 方法 A：使用 curl（推荐）⭐

在终端运行：

```bash
curl -X POST https://你的域名.vercel.app/api/admin/set-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"你的邮箱@example.com"}'
```

**替换**：
- `你的域名.vercel.app` → 你的实际域名（如 `jeffrey-lee-blog.vercel.app`）
- `你的邮箱@example.com` → 你注册时使用的邮箱

#### 方法 B：使用浏览器（需要扩展）

1. **安装浏览器扩展**：
   - Chrome: "REST Client" 或 "Postman"
   - 或使用在线工具：https://reqbin.com/

2. **发送 POST 请求**：
   - URL: `https://你的域名.vercel.app/api/admin/set-admin`
   - Method: `POST`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "email": "你的邮箱@example.com"
     }
     ```

#### 方法 C：使用 JavaScript（在浏览器控制台）

1. 打开你的网站
2. 按 F12 打开开发者工具
3. 在 Console 中运行：

```javascript
fetch('https://你的域名.vercel.app/api/admin/set-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: '你的邮箱@example.com' })
})
.then(r => r.json())
.then(console.log)
```

---

## 验证是否成功

### 方法 1：查看 API 响应
如果成功，会返回：
```json
{
  "success": true,
  "message": "User your@email.com is now admin",
  "user": {
    "id": "...",
    "email": "your@email.com",
    "role": "admin"
  }
}
```

### 方法 2：登录验证
1. 退出登录（如果已登录）
2. 重新登录
3. 应该能看到「后台」和「上传」按钮

---

## 示例命令

假设你的域名是 `jeffrey-lee-blog.vercel.app`，邮箱是 `admin@example.com`：

```bash
curl -X POST https://jeffrey-lee-blog.vercel.app/api/admin/set-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

---

## ⚠️ 重要：使用后删除 API 路由

设置完成后，为了安全，记得删除这个文件：
- `src/app/api/admin/set-admin/route.ts`

或者我可以帮你删除。

---

## 如果 API 调用失败

告诉我错误信息，我会帮你解决！

