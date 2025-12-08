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
      name: user.name || user.username,
      email: user.email,
      image: user.image
    };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
    async session({ session, user }) {
      if (session.user && user) {
        // 从数据库获取用户信息
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: typeof user === "string" ? user : user.id }
          });
          
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.name = dbUser.name || dbUser.username || undefined;
            session.user.email = dbUser.email || undefined;
            session.user.image = dbUser.image || undefined;
            
            // 检查是否为管理员
            if (dbUser.email) {
              const email = dbUser.email.toLowerCase();
              session.user.isAdmin = adminEmails.includes(email) || dbUser.role === "admin";
            }
          }
        } catch (error) {
          console.error("获取用户信息失败:", error);
        }
      }
      return session;
    }
  }
});

