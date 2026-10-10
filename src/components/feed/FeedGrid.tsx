"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/feed/PostCard";
import { PostWithAuthor } from "@/types";
import { Terminal, PlusCircle, Keyboard, X } from "lucide-react";
import Link from "next/link";

interface FeedGridProps {
  posts: PostWithAuthor[];
}

export default function FeedGrid({ posts }: FeedGridProps) {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (posts.length === 0) return;

      // 'j' or 'ArrowDown' -> Move down
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev === null ? 0 : Math.min(prev + 1, posts.length - 1);
          scrollToCard(next);
          return next;
        });
      }

      // 'k' or 'ArrowUp' -> Move up
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          scrollToCard(next);
          return next;
        });
      }

      // 'Enter' -> Open dispatch debrief
      if (e.key === "Enter" && focusedIndex !== null && posts[focusedIndex]) {
        e.preventDefault();
        router.push(`/dispatch/${posts[focusedIndex].id}`);
      }

      // 'o' -> Open external raw source in new tab
      if (e.key === "o" && focusedIndex !== null && posts[focusedIndex]) {
        e.preventDefault();
        window.open(posts[focusedIndex].sourceUrl, "_blank", "noopener,noreferrer");
      }

      // 'b' -> Trigger signal boost on focused post
      if (e.key === "b" && focusedIndex !== null && posts[focusedIndex]) {
        e.preventDefault();
        const boostBtn = document.getElementById(
          `boost-btn-${posts[focusedIndex].id}`
        );
        boostBtn?.click();
      }

      // 'c' -> Create/transmit new intel
      if (e.key === "c") {
        e.preventDefault();
        router.push("/submit");
      }

      // '/' -> Focus search input
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="grep"], input[placeholder*="search"]'
        );
        searchInput?.focus();
      }

      // 'Escape' -> Clear active focus
      if (e.key === "Escape" && focusedIndex !== null) {
        setFocusedIndex(null);
      }
    };

    const scrollToCard = (index: number) => {
      setTimeout(() => {
        const card = document.getElementById(`dispatch-card-${index}`);
        card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 20);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posts, focusedIndex, router]);

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
          No verified dispatches match the current filter parameters. Operators
          may submit new intelligence packets via the submission portal.
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
    <div className="space-y-4">
      {/* Dynamic Vim Status Pill when engaged */}
      {focusedIndex !== null && (
        <div className="sticky top-20 z-30 flex items-center justify-between p-2.5 bg-[#0f1724]/95 border border-[var(--accent)] text-xs font-mono text-[var(--accent)] backdrop-blur-md shadow-lg hud-chamfer">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 animate-pulse text-[var(--accent)]" />
            <span>
              VIM_NAV: [{focusedIndex + 1}/{posts.length}] FOCUSED —{" "}
              <span className="text-[#e6edf3] font-bold">
                {posts[focusedIndex]?.title.slice(0, 45)}...
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#8b949e]">
            <span className="hidden sm:inline">[ENTER] Read</span>
            <span className="hidden sm:inline">[B] Boost</span>
            <span className="hidden sm:inline">[O] Source</span>
            <button
              onClick={() => setFocusedIndex(null)}
              className="text-[#8b949e] hover:text-[#ff5555] transition-colors p-0.5"
              title="Dismiss focus (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {posts.map((post, idx) => (
          <PostCard
            key={post.id}
            post={post}
            cardId={`dispatch-card-${idx}`}
            isFocused={idx === focusedIndex}
          />
        ))}
      </div>
    </div>
  );
}
