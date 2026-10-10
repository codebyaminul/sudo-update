import React from "react";
import Link from "next/link";
import TerminalImage from "@/components/ui/TerminalImage";
import SourceBadge from "@/components/feed/SourceBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import BoostButton from "@/components/feed/BoostButton";
import { formatTerminalDate } from "@/lib/utils";
import { PostWithAuthor } from "@/types";
import { User, Clock, MessageSquare } from "lucide-react";

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.name || post.author?.email || "anon_op";

  return (
    <article className="flex flex-col bg-[#0d131d] border border-[#1d273a] hover:border-[var(--accent)] transition-all duration-200 overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,102,0.12)] hud-chamfer relative">
      {/* Top Corner HUD accent mark */}
      <div
        className="absolute top-0 right-0 w-3 h-3 bg-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
      />

      {/* Terminal Card Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#101724] border-b border-[#1d273a] text-[11px] font-mono text-[#8b949e]">
        <div className="flex items-center gap-2">
          <CategoryBadge category={post.category} />
          <span className="text-[#32435e] select-none">|</span>
          <span className="flex items-center gap-1 text-[#6b7280]">
            <Clock className="w-3 h-3 text-[#4b5563]" />
            {formatTerminalDate(post.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#9ca3af]">
          <User className="w-3 h-3 text-[var(--accent)]" />
          <span className="truncate max-w-[110px]">@{authorName}</span>
        </div>
      </div>

      {/* Media Thumbnail */}
      <Link href={`/dispatch/${post.id}`} className="relative block group/img">
        <TerminalImage src={post.imageUrl} alt={post.title} aspectRatio="video" />
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/dispatch/${post.id}`} className="block">
            <h2 className="text-base font-bold font-mono text-[#e6edf3] group-hover:text-[var(--accent)] transition-colors line-clamp-2 mb-2 leading-snug">
              {post.title}
            </h2>
          </Link>

          <p className="text-xs font-mono text-[#8b949e] line-clamp-3 mb-4 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Footer info: Boost Signal, Comments & Source Link */}
        <div className="pt-3 border-t border-[#1d273a] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <BoostButton
              postId={post.id}
              initialCount={post._count?.boosts ?? 0}
              initialHasBoosted={post.hasBoosted ?? false}
            />
            <Link
              href={`/dispatch/${post.id}#comments`}
              className="flex items-center gap-1 text-[11px] font-mono text-[#8b949e] hover:text-[var(--accent)] transition-colors px-2 py-1 border border-[#1f2638] hover:border-[var(--accent)] bg-[#0c1018]"
              title="View Operator Field Notes"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{post._count?.comments ?? 0}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <SourceBadge url={post.sourceUrl} />
            <span className="text-[10px] font-mono text-[#4b5563] hidden sm:inline select-none">
              #{post.id.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
