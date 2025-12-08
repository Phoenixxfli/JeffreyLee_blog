import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/authz";

export async function deleteMessage(id: string) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) throw new Error("Forbidden");
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/guestbook");
}

