import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 临时 API：设置管理员
// ⚠️ 使用后记得删除此文件！
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now admin`,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ 
        error: "User not found. Please register first." 
      }, { status: 404 });
    }
    return NextResponse.json({ 
      error: error.message || "Failed to update user" 
    }, { status: 500 });
  }
}

