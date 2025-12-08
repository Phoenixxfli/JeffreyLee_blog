import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  return { session, isAdmin };
}

