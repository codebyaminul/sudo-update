import React from "react";
import PostCard from "@/components/feed/PostCard";
import { PostWithAuthor } from "@/types";
import { Terminal, ShieldAlert } from "lucide-react";

interface FeedGridProps {
  posts: PostWithAuthor[];
}

export default function FeedGrid({ posts }: FeedGridProps) {
  if (posts.length === 0) {
    return (
      <div className="w-full my-8 p-8 border border-dashed border-[#1f2937] bg-[#0b1017] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border border-[#00ff66]/40 bg-[#00ff66]/10 flex items-center justify-center mb-3">
          <Terminal className="w-6 h-6 text-[#00ff66]" />
        </div>
        <h3 className="text-sm font-mono text-[#00ff66] font-bold tracking-wider mb-1">
          [ SYSTEM_BUFFER_EMPTY ]
        </h3>
        <p className="text-xs font-mono text-[#8b949e] max-w-md mb-4">
          No verified dispatches found for the selected query. Operators may submit new intelligence packets via the submission portal.
        </p>
        <a
          href="/submit"
          className="text-xs font-mono border border-[#00ff66]/50 bg-[#00ff66]/10 px-3 py-1.5 text-[#00ff66] hover:bg-[#00ff66]/20 transition-all inline-flex items-center gap-1.5"
        >
          <span>&gt; TRANSMIT INTEL PACKET</span>
        </a>
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
