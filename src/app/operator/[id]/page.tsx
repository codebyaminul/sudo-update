import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import { DEMO_POSTS } from "@/lib/mock-data";
import PostCard from "@/components/feed/PostCard";
import { formatTerminalDate } from "@/lib/utils";
import {
  Terminal,
  Shield,
  ArrowLeft,
  Radio,
  MessageSquare,
  Award,
  Zap,
  Calendar,
  KeyRound,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface OperatorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OperatorPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Operator Dossier // sudo update`,
    description: `Community intelligence operator cryptographic profile and transmission record.`,
  };
}

async function getOperatorDossier(id: string) {
  try {
    const operator = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { email: id }, { name: id }],
      },
      include: {
        posts: {
          where: { status: PostStatus.APPROVED },
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
            _count: { select: { boosts: true, comments: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            comments: true,
            boosts: true,
          },
        },
      },
    });

    if (operator) {
      // Calculate total boosts received across all approved posts
      let totalBoosts = 0;
      for (const p of operator.posts) {
        totalBoosts += p._count?.boosts ?? 0;
      }

      return {
        operator: {
          ...operator,
          totalBoosts,
        },
        isDemo: false,
      };
    }
  } catch (err) {
    console.error("Error fetching operator dossier:", err);
  }

  // Fallback demo dossier
  const matchingDemoPosts = DEMO_POSTS.filter(
    (p) => p.authorId === id || p.author?.name === id || id === "root" || id === "operator"
  );

  return {
    operator: {
      id: id || "usr_root_admin_001",
      name: id === "operator" ? "chief_operator" : "root_operator",
      email: id === "operator" ? "operator@sudoupdate.dev" : "root@sudoupdate.dev",
      image: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
      isAdmin: id !== "operator",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(),
      posts: matchingDemoPosts.length > 0 ? matchingDemoPosts : DEMO_POSTS.slice(0, 4),
      totalBoosts: 84,
      _count: {
        comments: 16,
        boosts: 32,
      },
    },
    isDemo: true,
  };
}

export default async function OperatorDossierPage({ params }: OperatorPageProps) {
  const { id } = await params;
  const { operator, isDemo } = await getOperatorDossier(id);

  if (!operator) {
    notFound();
  }

  const displayName = operator.name || operator.email?.split("@")[0] || "operator";
  const dispatchesCount = operator.posts.length;
  const totalBoosts = operator.totalBoosts;
  const commentsCount = operator._count.comments;
  const reputationScore = dispatchesCount * 10 + totalBoosts * 5 + commentsCount * 2;

  // Clearance determination
  let clearanceTitle = "RECON_SCOUT (LVL 4)";
  let clearanceBadgeClass = "border-[#4b5563] text-[#9ca3af] bg-[#111622]";

  if (operator.isAdmin) {
    clearanceTitle = "ROOT_DIRECTOR (LVL 0)";
    clearanceBadgeClass =
      "border-[#ff5555] text-[#ff5555] bg-[#ff5555]/10 shadow-[0_0_12px_rgba(255,85,85,0.3)]";
  } else if (totalBoosts >= 50) {
    clearanceTitle = "CHIEF_INTEL_OFFICER (LVL 1)";
    clearanceBadgeClass =
      "border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_12px_rgba(0,240,255,0.3)]";
  } else if (totalBoosts >= 15) {
    clearanceTitle = "FIELD_OPERATOR (LVL 2)";
    clearanceBadgeClass =
      "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] shadow-[0_0_12px_rgba(0,255,102,0.3)]";
  } else if (dispatchesCount >= 1) {
    clearanceTitle = "VERIFIED_AGENT (LVL 3)";
    clearanceBadgeClass = "border-[#ffb454] text-[#ffb454] bg-[#ffb454]/10";
  }

  const fingerprint = `SHA256:${Buffer.from(operator.id + operator.email)
    .toString("hex")
    .slice(0, 24)
    .toUpperCase()}`;

  return (
    <div className="space-y-8 font-mono select-none">
      {/* Return Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#8b949e]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors py-1 px-2 border border-transparent hover:border-[#1f2638] bg-[#090d14]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>guest@sudoupdate:~$ cd .. // RETURN_TO_FEED</span>
        </Link>
        <span className="text-[11px] text-[#4b5563] hidden sm:inline">
          DOSSIER_LOC: /operators/{operator.id}
        </span>
      </div>

      {/* Main Dossier Header Box */}
      <div className="border border-[#1f2638] bg-[#0c1018] p-6 sm:p-8 hud-chamfer-top space-y-6 relative overflow-hidden">
        {/* Top Identification Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1b2536]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-[var(--accent)] bg-[#070b12] flex items-center justify-center hud-chamfer-top shrink-0 text-xl font-bold text-[var(--accent)] shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-[#e6edf3] tracking-tight">
                  @{displayName}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 border ${clearanceBadgeClass}`}
                >
                  {clearanceTitle}
                </span>
              </div>
              <div className="text-xs text-[#8b949e] flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-[var(--accent)]" />
                  ID: #{operator.id.slice(-8)}
                </span>
                <span className="text-[#32435e]">|</span>
                <span className="flex items-center gap-1 text-[#6b7280]">
                  <Calendar className="w-3 h-3" />
                  JOINED: {formatTerminalDate(operator.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end text-xs text-[#8b949e] space-y-1 bg-[#070c14] p-3 border border-[#16202f]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-[var(--accent)] font-bold">NODE_STATUS: ACTIVE</span>
            </div>
            <div className="text-[10px] text-[#4b5563] break-all">
              {fingerprint}
            </div>
          </div>
        </div>

        {/* 4-Box Telemetry Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-[#1b2536] bg-[#080d14] hud-chamfer">
            <div className="text-[10px] text-[#6b7280] mb-1 flex items-center gap-1">
              <Radio className="w-3 h-3 text-[var(--accent)]" />
              DISPATCHES FILED
            </div>
            <div className="text-2xl font-extrabold text-[#e6edf3]">
              {dispatchesCount}
            </div>
          </div>

          <div className="p-4 border border-[#1b2536] bg-[#080d14] hud-chamfer">
            <div className="text-[10px] text-[#6b7280] mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[var(--accent)]" />
              SIGNAL AMPLIFIED
            </div>
            <div className="text-2xl font-extrabold text-[var(--accent)] text-phosphor-glow">
              {totalBoosts}
            </div>
          </div>

          <div className="p-4 border border-[#1b2536] bg-[#080d14] hud-chamfer">
            <div className="text-[10px] text-[#6b7280] mb-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#00f0ff]" />
              FIELD NOTES
            </div>
            <div className="text-2xl font-extrabold text-[#00f0ff]">
              {commentsCount}
            </div>
          </div>

          <div className="p-4 border border-[#1b2536] bg-[#080d14] hud-chamfer">
            <div className="text-[10px] text-[#6b7280] mb-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-[#ffb454]" />
              REPUTATION SCORE
            </div>
            <div className="text-2xl font-extrabold text-[#ffb454]">
              {reputationScore} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Operator Dispatches Archive Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2638] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#e6edf3]">
            <Terminal className="w-4 h-4 text-[var(--accent)]" />
            <span>
              // TRANSMISSION_ARCHIVE [@{displayName} // {dispatchesCount} DISPATCHES]
            </span>
          </div>
          <span className="text-[10px] text-[#6b7280]">
            CLEARANCE: VERIFIED_PUBLIC
          </span>
        </div>

        {dispatchesCount === 0 ? (
          <div className="p-12 border border-dashed border-[#1f2638] bg-[#0c1018] text-center hud-chamfer">
            <p className="text-xs text-[#8b949e]">
              // NO VERIFIED DISPATCHES FILED UNDER THIS OPERATOR DOSSIER.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operator.posts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
