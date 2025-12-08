import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailServer = process.env.EMAIL_SERVER;
const emailFrom = process.env.EMAIL_FROM || "no-reply@example.com";

const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const isEmailConfigured = !!(resend || emailServer);

// 为避免未配置邮件服务时报错，提供一个安全的占位 SMTP（不会实际发送）
const fallbackServer = {
  host: "localhost",
  port: 25,
  auth: { user: "", pass: "" }
};

const provider = EmailProvider({
  server: emailServer || fallbackServer,
  from: emailFrom,
  sendVerificationRequest: async ({ identifier, url, provider: pr }) => {
    if (resend) {
      await resend.emails.send({
        from: pr.from ?? emailFrom,
        to: identifier,
        subject: "登录你的博客",
        html: `<p>点击登录链接：</p><p><a href="${url}">${url}</a></p><p>如果不是你本人操作，请忽略。</p>`
      });
      return;
    }
    if (!isEmailConfigured) {
      console.warn("未配置 RESEND_API_KEY / EMAIL_SERVER，将跳过发送（仅开发占位）。");
      return;
    }
    const transport = nodemailer.createTransport(emailServer);
    await transport.sendMail({
      to: identifier,
      from: pr.from ?? emailFrom,
      subject: "登录你的博客",
      html: `<p>点击登录链接：</p><p><a href="${url}">${url}</a></p><p>如果不是你本人操作，请忽略。</p>`
    });
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
  providers: [provider],
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

