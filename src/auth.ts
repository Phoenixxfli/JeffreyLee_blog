import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-helpers";

const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "用户名或邮箱", type: "text" },
    password: { label: "密码", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) {
      return null;
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: credentials.username },
          { email: credentials.username }
        ]
      }
    });

    if (!user || !user.password) {
      return null;
    }

    // 验证密码
    const isValid = await verifyPassword(credentials.password as string, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name || user.username || undefined,
      email: user.email || undefined,
      image: user.image || undefined
    };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Credentials Provider 使用 JWT session strategy，不需要 adapter
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret",
  pages: {
    signIn: "/auth/signin"
  },
  providers: [credentialsProvider],
  callbacks: {
    async signIn({ user }) {
      // Credentials Provider 登录后，更新用户角色
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "admin" }
          });
        } catch (error) {
          console.error("更新用户角色失败:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // 首次登录时，user 对象包含用户信息
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        
        // 从数据库获取用户信息以检查管理员状态
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
          });
          
          if (dbUser) {
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.name || dbUser.username;
            token.image = dbUser.image;
            
            // 检查是否为管理员
            if (dbUser.role === "admin") {
              token.isAdmin = true;
            } else if (dbUser.email) {
              const email = dbUser.email.toLowerCase();
              token.isAdmin = adminEmails.includes(email);
            } else {
              token.isAdmin = false;
            }
          }
        } catch (error) {
          console.error("获取用户信息失败:", error);
          token.isAdmin = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        if (token.id && typeof token.id === "string") {
          session.user.id = token.id;
        }
        if (token.email && typeof token.email === "string") {
          session.user.email = token.email;
        }
        if (token.name && typeof token.name === "string") {
          session.user.name = token.name;
        }
        if (token.image && typeof token.image === "string") {
          session.user.image = token.image;
        }
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      }
      return session;
    }
  }
});

