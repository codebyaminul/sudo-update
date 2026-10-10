import React from "react";
import prisma from "@/lib/prisma";
import { PostCategory, PostStatus } from "@prisma/client";
import CategoryFilter from "@/components/feed/CategoryFilter";
import TerminalSearch from "@/components/feed/TerminalSearch";
import FeedGrid from "@/components/feed/FeedGrid";
import CurlBanner from "@/components/feed/CurlBanner";
import { Terminal, ShieldCheck, Cpu, Database, Search, X } from "lucide-react";
import { PostWithAuthor } from "@/types";
import { DEMO_POSTS } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}

async function getApprovedPosts(
  category?: string,
  sort?: string,
  query?: string,
  userId?: string
): Promise<{
  posts: PostWithAuthor[];
  isDemoFallback: boolean;
}> {
  try {
    const whereClause: any = {
      status: PostStatus.APPROVED,
    };

    if (category && Object.values(PostCategory).includes(category as PostCategory)) {
      whereClause.category = category as PostCategory;
    }

    if (query && query.trim()) {
      const q = query.trim();
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { sourceUrl: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderByClause =
      sort === "top"
        ? [{ boosts: { _count: "desc" as const } }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const rawPosts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            boosts: true,
            comments: true,
          },
        },
        boosts: userId
          ? {
              where: {
                userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
      orderBy: orderByClause,
      take: 60,
    });

    if (rawPosts.length > 0) {
      const posts: PostWithAuthor[] = rawPosts.map((p: any) => ({
        ...p,
        hasBoosted: Boolean(p.boosts && p.boosts.length > 0),
      }));
      return { posts, isDemoFallback: false };
    }
  } catch (err) {
    // Database fallback
  }

  // Offline / development demo fallback
  let filtered = DEMO_POSTS.map((p) => ({
    ...p,
    _count: {
      boosts: Math.floor(Math.random() * 25) + 3,
      comments: Math.floor(Math.random() * 8) + 1,
    },
    hasBoosted: false,
  }));

  if (category && Object.values(PostCategory).includes(category as PostCategory)) {
    filtered = filtered.filter((p) => p.category === (category as PostCategory));
  }

  if (query && query.trim()) {
    const qLower = query.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(qLower) ||
        p.content.toLowerCase().includes(qLower) ||
        p.sourceUrl.toLowerCase().includes(qLower)
    );
  }

  if (sort === "top") {
    filtered.sort((a, b) => (b._count?.boosts ?? 0) - (a._count?.boosts ?? 0));
  }

  return { posts: filtered, isDemoFallback: true };
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const currentSort = resolvedParams.sort || "latest";
  const currentQuery = resolvedParams.q || "";

  const user = await getCurrentUser();
  const { posts, isDemoFallback } = await getApprovedPosts(
    currentCategory,
    currentSort,
    currentQuery,
    user?.id
  );

  return (
    <div className="space-y-6">
      {/* Terminal Hero / Status Header */}
      <div className="border border-[#1f2638] bg-[#0c1018] p-4 sm:p-6 relative overflow-hidden hud-chamfer-top">
        <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
          <Cpu className="w-24 h-24 text-[var(--accent)]" />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] mb-2">
          <Terminal className="w-4 h-4" />
          <span>guest@sudoupdate:~$ ./fetch_dispatches.sh --channel=public --sort={currentSort}</span>
          <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-blink" aria-hidden="true" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#e6edf3] tracking-tight mb-2">
          SUDO UPDATE // <span className="text-[var(--accent)] text-phosphor-glow">INTELLIGENCE FEED</span>
        </h1>

        <p className="text-xs sm:text-sm font-mono text-[#8b949e] max-w-2xl leading-relaxed">
          Community-verified dispatches covering Technology, Artificial Intelligence, Esports, Cinema, Sports, and Global Affairs. All submissions are cryptographically queued and root-moderated.
        </p>

        <div className="mt-4 pt-4 border-t border-[#1f2638] flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#9ca3af]">
          <span className="flex items-center gap-1.5 text-[var(--accent)] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            CLEARANCE: VERIFIED ONLY
          </span>
          <span className="text-[#32435e]">|</span>
          <span>BUFFER COUNT: {posts.length} DISPATCHES</span>
          <span className="text-[#32435e]">|</span>
          {isDemoFallback ? (
            <span className="text-[#ffb454] flex items-center gap-1">
              <Database className="w-3 h-3" />
              MODE: LOCAL_DEMO_BUFFER
            </span>
          ) : (
            <span className="text-[var(--accent)]">MODE: LIVE_SUPABASE_POOL</span>
          )}
          <span className="text-[#32435e]">|</span>
          <span className="text-[#00f0ff]">SORT: [{currentSort.toUpperCase()}]</span>
        </div>
      </div>

      {/* Real Terminal Curl Command Bar */}
      <CurlBanner />

      {/* Terminal CLI Search Command Bar */}
      <TerminalSearch />

      {/* Search Query Active Pill */}
      {currentQuery && (
        <div className="flex items-center justify-between p-2.5 bg-[#111722] border border-[#59c2ff]/40 text-xs font-mono text-[#59c2ff]">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>
              FILTER_REGEX: <span className="text-[#e5e7eb] font-bold">"{currentQuery}"</span> — MATCHED {posts.length} PACKET(S)
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-[#ff5555] hover:underline"
          >
            <X className="w-3 h-3" />
            <span>[RESET_FILTER]</span>
          </Link>
        </div>
      )}

      {/* Category Pills & Sort Switcher Filter */}
      <CategoryFilter />

      {/* Responsive Grid */}
      <FeedGrid posts={posts} />
    </div>
  );
}
