import React from "react";
import TerminalImage from "@/components/ui/TerminalImage";
import SourceBadge from "@/components/feed/SourceBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import BoostButton from "@/components/feed/BoostButton";
import { formatTerminalDate } from "@/lib/utils";
import { PostWithAuthor } from "@/types";
import { User, Clock } from "lucide-react";

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.name || post.author?.email || "anonymous_operator";

  return (
    <article className="flex flex-col bg-[#0d121a] border border-[#1f2937] hover:border-[#00ff66]/60 transition-all duration-200 overflow-hidden group hover:shadow-[0_0_15px_rgba(0,255,102,0.1)]">
      {/* Terminal Card Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#111620] border-b border-[#1f2937] text-[11px] font-mono text-[#8b949e]">
        <div className="flex items-center gap-2">
          <CategoryBadge category={post.category} />
          <span className="text-[#374151]">|</span>
          <span className="flex items-center gap-1 text-[#6b7280]">
            <Clock className="w-3 h-3" />
            {formatTerminalDate(post.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#9ca3af]">
          <User className="w-3 h-3 text-[#00ff66]/70" />
          <span className="truncate max-w-[120px]">@{authorName}</span>
        </div>
      </div>

      {/* Media Thumbnail */}
      <div className="relative">
        <TerminalImage src={post.imageUrl} alt={post.title} aspectRatio="video" />
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-bold font-mono text-[#e5e7eb] group-hover:text-[#00ff66] transition-colors line-clamp-2 mb-2 leading-snug">
            {post.title}
          </h2>

          <p className="text-xs font-mono text-[#9ca3af] line-clamp-3 mb-4 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Footer info: Boost Signal & Source Link */}
        <div className="pt-3 border-t border-[#1f2937]/60 flex items-center justify-between gap-2">
          <BoostButton
            postId={post.id}
            initialCount={post._count?.boosts ?? 0}
            initialHasBoosted={post.hasBoosted ?? false}
          />
          <div className="flex items-center gap-2">
            <SourceBadge url={post.sourceUrl} />
            <span className="text-[10px] font-mono text-[#4b5563] hidden sm:inline">
              #{post.id.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
