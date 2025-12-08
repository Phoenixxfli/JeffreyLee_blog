"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_LEN = 500;

export async function addMessage(formData: FormData) {
  const name = (formData.get("name") as string | null)?.slice(0, 80) || "访客";
  const content = (formData.get("content") as string | null)?.trim() || "";
  
  if (!content) {
    throw new Error("留言不能为空");
  }
  if (content.length > MAX_LEN) {
    throw new Error(`最多 ${MAX_LEN} 字`);
  }
  
  await prisma.message.create({
    data: { name, content }
  });
  
  revalidatePath("/guestbook");
  redirect("/guestbook");
}

