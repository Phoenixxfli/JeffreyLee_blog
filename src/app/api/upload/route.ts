import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const MAX_SIZE_MB = 50;
const ALLOWED = /\.(png|jpe?g|gif|webp|mp4|webm|mov|mp3|wav|m4a)$/i;

async function saveLocal(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${timestamp}-${safeName}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

function getR2Client() {
  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = process.env;
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) return null;
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });
}

async function saveR2(file: File) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_BASE_URL;
  if (!client || !bucket || !publicBase) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${timestamp}-${safeName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || undefined
    })
  );
  return `${publicBase}/${key}`;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "未授权" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "缺少文件" }, { status: 400 });
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: "文件过大，限制 50MB" }, { status: 400 });
  }
  if (!ALLOWED.test(file.name)) {
    return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 });
  }

  // 若配置了 R2 则优先使用，否则回退本地
  const cloudUrl = await saveR2(file);
  const url = cloudUrl ?? (await saveLocal(file));
  return NextResponse.json({ url });
}

