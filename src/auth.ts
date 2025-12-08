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
    const isValid = await verifyPassword(credentials.password, user.password);
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
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret",
  pages: {
    signIn: "/auth/signin"
  },
  providers: [credentialsProvider],
  callbacks: {
    session: async ({ session }) => {
      if (session.user?.email) {
        const email = session.user.email.toLowerCase();
        session.user.isAdmin = adminEmails.includes(email);
      }
      return session;
    },
    signIn: async ({ user }) => {
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin" }
        });
      }
      return true;
    }
  }
});

