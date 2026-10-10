import React from "react";
import PostCard from "@/components/feed/PostCard";
import { PostWithAuthor } from "@/types";
import { Terminal, PlusCircle } from "lucide-react";
import Link from "next/link";

interface FeedGridProps {
  posts: PostWithAuthor[];
}

export default function FeedGrid({ posts }: FeedGridProps) {
  if (posts.length === 0) {
    return (
      <div className="w-full my-8 p-12 border border-dashed border-[#1f2638] bg-[#0c1018] flex flex-col items-center justify-center text-center hud-chamfer font-mono">
        <div className="w-12 h-12 border border-[var(--accent)] bg-[var(--accent-muted)] flex items-center justify-center mb-3 hud-chamfer-top">
          <Terminal className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <h3 className="text-sm text-[var(--accent)] font-bold tracking-wider mb-1 text-phosphor-glow">
          [ SYSTEM_BUFFER_EMPTY ]
        </h3>
        <p className="text-xs text-[#8b949e] max-w-md mb-4 leading-relaxed">
          No verified dispatches match the current filter parameters. Operators may submit new intelligence packets via the submission portal.
        </p>
        <Link
          href="/submit"
          className="text-xs border border-[var(--accent)] bg-[var(--accent-muted)] px-4 py-2 text-[var(--accent)] hover:brightness-125 transition-all inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.15)] cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>&gt; TRANSMIT INTEL PACKET</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
