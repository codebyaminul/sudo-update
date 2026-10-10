import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostCategory, PostStatus } from "@prisma/client";
import { DEMO_POSTS } from "@/lib/mock-data";

export const revalidate = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "latest";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
  const format = searchParams.get("format");
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";

  // Fetch posts from database
  let posts: any[] = [];
  try {
    const where: any = { status: PostStatus.APPROVED };
    if (category && Object.values(PostCategory).includes(category as PostCategory)) {
      where.category = category as PostCategory;
    }

    const orderBy =
      sort === "top"
        ? [{ boosts: { _count: "desc" as const } }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true, isAdmin: true },
        },
        _count: {
          select: { boosts: true, comments: true },
        },
      },
      orderBy,
      take: limit,
    });
  } catch {
    posts = DEMO_POSTS.map((p) => ({
      ...p,
      _count: { boosts: 12, comments: 2 },
    }));
    if (category) {
      posts = posts.filter((p) => p.category === category);
    }
  }

  // If format=json explicitly requested, return clean JSON
  if (format?.toLowerCase().trim().replace(/['"]/g, "") === "json") {
    return NextResponse.json({
      network: "sudo_update",
      version: "1.2.0",
      count: posts.length,
      category: category || "ALL",
      sort,
      data: posts,
    });
  }

  // CLI ANSI Output for curl / terminal users
  const isTerminal =
    userAgent.toLowerCase().includes("curl") ||
    userAgent.toLowerCase().includes("wget") ||
    acceptHeader.includes("text/plain") ||
    format === "cli" ||
    !acceptHeader.includes("text/html");

  const C_GREEN = "\x1b[1;32m";
  const C_CYAN = "\x1b[36m";
  const C_AMBER = "\x1b[33m";
  const C_GRAY = "\x1b[90m";
  const C_WHITE = "\x1b[1;37m";
  const C_MAGENTA = "\x1b[35m";
  const C_RESET = "\x1b[0m";
  const C_BOLD = "\x1b[1m";

  const host = request.headers.get("host") || "sudo-update.vercel.app";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let out = "";
  out += `${C_GREEN}   ___ _   _ ____   ___    _   _ ____  ____    _  _____ _____ ${C_RESET}\n`;
  out += `${C_GREEN}  / ___| | | |  _ \\ / _ \\  | | | |  _ \\|  _ \\  / \\|_   _| ____|${C_RESET}\n`;
  out += `${C_GREEN}  \\___ \\| | | | | | | | |  | | | | |_) | | | |/ _ \\ | | |  _|  ${C_RESET}\n`;
  out += `${C_GREEN}   ___) | |_| | |_| | |_|  | |_| |  __/| |_| / ___ \\| | | |___ ${C_RESET}\n`;
  out += `${C_GREEN}  |____/ \\___/|____/ \\___/  \\___/|_|   |____/_/   \\_\\_| |_____|${C_RESET}\n\n`;

  out += `${C_CYAN}[ COMMUNITY_INTEL_NETWORK // v1.2.0 // DEPLOYED: LIVE ]${C_RESET}\n`;
  out += `${C_GRAY}BUFFER: ${posts.length} DISPATCHES | SORT: [${sort.toUpperCase()}] | CATEGORY: [${(category || "ALL").toUpperCase()}]${C_RESET}\n`;
  out += `${C_GRAY}ENDPOINT: curl -s ${baseUrl}/api/feed${C_RESET}\n\n`;
  out += `${C_GRAY}─────────────────────────────────────────────────────────────────────────────${C_RESET}\n\n`;

  if (posts.length === 0) {
    out += `${C_AMBER}// NO ACTIVE DISPATCHES RECORDED UNDER CURRENT FILTERS.${C_RESET}\n\n`;
  } else {
    posts.forEach((p, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      const dateStr = new Date(p.createdAt).toISOString().replace("T", " ").substring(0, 16) + "Z";
      const boosts = p._count?.boosts ?? 0;
      const comments = p._count?.comments ?? 0;
      const author = p.author?.name || p.author?.email || "anon_op";
      const rank = p.author?.isAdmin ? `${C_AMBER}[ROOT]${C_RESET}` : `${C_CYAN}[OP]${C_RESET}`;

      out += `${C_GREEN}[${num}]${C_RESET} ${C_GRAY}${dateStr}${C_RESET}  ${C_MAGENTA}[#${p.category}]${C_RESET}  ${C_GREEN}[▲ ${boosts} SIGNAL]${C_RESET}  ${C_CYAN}[💬 ${comments} LOGS]${C_RESET}\n`;
      out += ` ${C_WHITE}┌─ TITLE:${C_RESET} ${C_BOLD}${p.title}${C_RESET}\n`;
      out += ` ${C_GRAY}├─ OPERATOR:${C_RESET} @${author} ${rank}\n`;
      out += ` ${C_GRAY}├─ SOURCE:${C_RESET}   ${C_CYAN}${p.sourceUrl}${C_RESET}\n`;
      out += ` ${C_GRAY}├─ INTEL:${C_RESET}    ${p.content.slice(0, 120)}...\n`;
      out += ` ${C_GRAY}└─ DEBRIEF:${C_RESET}  ${C_GREEN}${baseUrl}/dispatch/${p.id}${C_RESET}\n\n`;
    });
  }

  out += `${C_GRAY}─────────────────────────────────────────────────────────────────────────────${C_RESET}\n`;
  out += `${C_AMBER}CLI USAGE COMMANDS:${C_RESET}\n`;
  out += `  ${C_GRAY}>${C_RESET} curl -s "${baseUrl}/api/feed?category=AI"\n`;
  out += `  ${C_GRAY}>${C_RESET} curl -s "${baseUrl}/api/feed?sort=top"\n`;
  out += `  ${C_GRAY}>${C_RESET} curl -s "${baseUrl}/api/feed?format=json"\n`;
  out += `  ${C_GRAY}>${C_RESET} curl -s "${baseUrl}/api/feed" | head -n 35\n\n`;

  return new NextResponse(out, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
