import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import { DEMO_POSTS } from "@/lib/mock-data";

export const revalidate = 60;

export async function GET(request: Request) {
  const host = request.headers.get("host") || "sudo-update.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: PostStatus.APPROVED },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    posts = DEMO_POSTS;
  }

  const itemsXml = posts
    .map((post) => {
      const pubDate = new Date(post.createdAt).toUTCString();
      const author = post.author?.name || post.author?.email || "anonymous_operator";
      const cleanContent = post.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const cleanTitle = post.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/dispatch/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/dispatch/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${post.category}</category>
      <author>${post.author?.email || "dispatch@sudoupdate.dev"} (${author})</author>
      <description><![CDATA[${cleanContent}]]></description>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>sudo update // Community Intel Network</title>
    <link>${baseUrl}</link>
    <description>Community-driven news dispatch platform with a dark-mode terminal aesthetic.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
