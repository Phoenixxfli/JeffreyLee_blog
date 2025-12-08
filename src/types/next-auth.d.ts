import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      isAdmin?: boolean;
    };
  }

  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    isAdmin?: boolean;
  }
}

