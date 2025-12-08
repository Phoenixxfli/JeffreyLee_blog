import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (post) => `
<item>
  <title><![CDATA[${post.title}]]></title>
  <link>${siteConfig.url}/blog/${post.slug}</link>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  <description><![CDATA[${post.summary ?? ""}]]></description>
</item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${siteConfig.url}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}

