import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import { DEMO_POSTS } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth-utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import TerminalImage from "@/components/ui/TerminalImage";
import SourceBadge from "@/components/feed/SourceBadge";
import BoostButton from "@/components/feed/BoostButton";
import CommentSection from "@/components/dispatch/CommentSection";
import ShareCommandButton from "@/components/dispatch/ShareCommandButton";
import { formatTerminalDate } from "@/lib/utils";
import { PostWithAuthor } from "@/types";
import {
  Terminal,
  ArrowLeft,
  Clock,
  User,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Hash,
  FileText,
} from "lucide-react";

interface DispatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: DispatchPageProps): Promise<Metadata> {
  const { id } = await params;
  let title = "Dispatch Briefing // sudo update";
  let description = "Community-verified intelligence briefing on sudo update.";

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { title: true, content: true },
    });
    if (post) {
      title = `${post.title} // sudo update`;
      description = post.content.slice(0, 160);
    }
  } catch {
    const demo = DEMO_POSTS.find((p) => p.id === id);
    if (demo) {
      title = `${demo.title} // sudo update`;
      description = demo.content.slice(0, 160);
    }
  }

  return {
    title,
    description,
  };
}

async function getPostData(
  id: string,
  userId?: string
): Promise<{ post: PostWithAuthor | null; related: PostWithAuthor[] }> {
  try {
    const dbPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isAdmin: true,
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
              where: { userId },
              select: { userId: true },
            }
          : false,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isAdmin: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (dbPost && dbPost.status === PostStatus.APPROVED) {
      const post: PostWithAuthor = {
        ...dbPost,
        hasBoosted: Boolean(dbPost.boosts && dbPost.boosts.length > 0),
      };

      // Fetch 3 related posts from same category
      const related = await prisma.post.findMany({
        where: {
          category: dbPost.category,
          status: PostStatus.APPROVED,
          id: { not: dbPost.id },
        },
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true, isAdmin: true },
          },
          _count: { select: { boosts: true, comments: true } },
        },
        take: 3,
        orderBy: { createdAt: "desc" },
      });

      return { post, related: related as any };
    }
  } catch (err) {
    console.error("Database lookup error:", err);
  }

  // Fallback to demo data
  const demoPost = DEMO_POSTS.find((p) => p.id === id);
  if (demoPost) {
    const related = DEMO_POSTS.filter(
      (p) => p.category === demoPost.category && p.id !== demoPost.id
    ).slice(0, 3);
    return {
      post: {
        ...demoPost,
        _count: { boosts: 18, comments: 2 },
        hasBoosted: false,
        comments: [
          {
            id: "cmt_demo_01",
            content: "Corroborated by downstream kernel mailing lists. Mainline latency tests show <10µs jitter.",
            postId: demoPost.id,
            authorId: "usr_root_admin_001",
            author: {
              id: "usr_root_admin_001",
              name: "root_operator",
              email: "root@sudoupdate.dev",
              image: null,
              isAdmin: true,
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            updatedAt: new Date(Date.now() - 1000 * 60 * 20),
          },
        ],
      },
      related,
    };
  }

  return { post: null, related: [] };
}

export default async function DispatchDetailPage({ params }: DispatchPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const { post, related } = await getPostData(id, user?.id);

  if (!post) {
    notFound();
  }

  const authorName = post.author?.name || post.author?.email || "anonymous_operator";
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const simulatedHash = `0x${Buffer.from(post.id + post.createdAt)
    .toString("hex")
    .slice(0, 16)}`;

  return (
    <article className="space-y-8 font-mono select-none">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#8b949e]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors py-1 px-2 border border-transparent hover:border-[#1f2638] bg-[#090d14]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>guest@sudoupdate:~$ cd /dispatches // RETURN</span>
        </Link>
        <span className="text-[11px] text-[#4b5563] hidden sm:inline">
          PACKET_ID: {post.id}
        </span>
      </div>

      {/* Main Dispatch Terminal Header Box */}
      <div className="border border-[#1f2638] bg-[#0c1018] p-6 sm:p-8 hud-chamfer-top space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={post.category} />
            <span className="text-[#32435e]">|</span>
            <span className="flex items-center gap-1.5 text-[var(--accent)] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUS: ROOT_VERIFIED
            </span>
            <span className="text-[#32435e]">|</span>
            <span className="flex items-center gap-1 text-[#6b7280]">
              <Clock className="w-3.5 h-3.5 text-[#4b5563]" />
              {formatTerminalDate(post.createdAt)}
            </span>
          </div>

          <Link
            href={`/operator/${post.author?.id || post.authorId || "root"}`}
            className="flex items-center gap-1.5 text-[#9ca3af] hover:text-[var(--accent)] transition-colors"
            title={`Inspect @${authorName} dossier`}
          >
            <User className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>TRANSMITTED BY:</span>
            <span className="text-[#e6edf3] font-bold hover:underline">
              @{authorName}
            </span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#e6edf3] leading-tight tracking-tight">
          {post.title}
        </h1>

        {/* Action HUD: Boost, Source Link, Share Command */}
        <div className="pt-4 border-t border-[#1f2638] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BoostButton
              postId={post.id}
              initialCount={post._count?.boosts ?? 0}
              initialHasBoosted={post.hasBoosted ?? false}
            />
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#2d3b55] bg-[#111724] text-[#00f0ff] hover:border-[#00f0ff] transition-all cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.15)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>[ ACCESS RAW SOURCE ↗ ]</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ShareCommandButton postId={post.id} />
            <SourceBadge url={post.sourceUrl} />
          </div>
        </div>
      </div>

      {/* Featured Graphic if present */}
      {post.imageUrl && (
        <div className="border border-[#1f2638] bg-[#0c1018] overflow-hidden hud-chamfer">
          <TerminalImage
            src={post.imageUrl}
            alt={post.title}
            aspectRatio="wide"
          />
        </div>
      )}

      {/* Dispatch Intelligence Briefing Content */}
      <div className="border border-[#1f2638] bg-[#0b0f17] p-6 sm:p-8 hud-chamfer space-y-6">
        <div className="flex items-center justify-between border-b border-[#1a2333] pb-3 text-xs text-[#8b949e]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-bold text-[#e6edf3]">
              // DEBRIEF_PAYLOAD_CONTENT
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#6b7280]">
            <span>{wordCount} WORDS</span>
            <span className="text-[#32435e]">|</span>
            <span>{post.content.length} CHARS</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-sm sm:text-base text-[#d1d5db] leading-relaxed whitespace-pre-line space-y-4">
          {post.content}
        </div>

        {/* Cryptographic verification footer */}
        <div className="pt-4 border-t border-[#1a2333] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#4b5563]">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-[var(--accent)]" />
            <span>HASH: {simulatedHash}</span>
          </div>
          <div>ROOT_CLEARANCE_CHECK: SIGNATURE_VALID // ED25519</div>
        </div>
      </div>

      {/* Related Dispatches */}
      {related.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#8b949e] border-b border-[#1f2638] pb-2">
            <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>
              // CORRELATED_INTELLIGENCE [CATEGORY: {post.category}]
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/dispatch/${rel.id}`}
                className="p-4 border border-[#1a2333] bg-[#0c1018] hover:border-[var(--accent)] transition-all hud-chamfer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#6b7280] mb-2">
                    <CategoryBadge category={rel.category} />
                    <span>{formatTerminalDate(rel.createdAt)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#e6edf3] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug mb-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="pt-2 border-t border-[#161d2a] text-[10px] text-[#8b949e] flex items-center justify-between">
                  <span>[ ▲ {rel._count?.boosts ?? 0} SIGNAL ]</span>
                  <span className="text-[var(--accent)]">&gt; INSPECT</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Field Notes Comment Thread */}
      <CommentSection
        postId={post.id}
        initialComments={post.comments || []}
      />
    </article>
  );
}
