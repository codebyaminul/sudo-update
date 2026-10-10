"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Terminal,
  Shield,
  Trash2,
  AlertTriangle,
  Clock,
  User,
  LogIn,
} from "lucide-react";
import { formatTerminalDate } from "@/lib/utils";
import { CommentWithAuthor } from "@/types";

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithAuthor[];
}

export default function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to transmit field note");
        return;
      }

      setComments((prev) => [...prev, json.data]);
      setNewContent("");
    } catch {
      setError("Network failure: Failed to reach dispatch pool");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("PURGE CONFIRMATION: Permanently remove this transmission log?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Purge failed: Insufficient clearance or network failure");
        return;
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      alert("Error contacting purge controller");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="comments" className="mt-12 space-y-6 font-mono select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#1f2638] pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-bold tracking-wider text-[#e6edf3]">
            // OPERATOR_FIELD_NOTES{" "}
            <span className="text-[var(--accent)] text-phosphor-glow">
              [{comments.length} LOGS]
            </span>
          </h2>
        </div>
        <span className="text-[10px] text-[#6b7280]">
          CLEARANCE: ENCRYPTED_THREAD
        </span>
      </div>

      {/* Input Box: Compose Transmission */}
      {session?.user ? (
        <form
          onSubmit={handleSubmit}
          className="border border-[#1f2638] bg-[#0c1018] p-4 hud-chamfer-top space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-[#8b949e]">
            <div className="flex items-center gap-1.5 text-[var(--accent)]">
              <Terminal className="w-3.5 h-3.5" />
              <span>
                {session.user.name || session.user.email}
                @sudoupdate:~$ append_intel
              </span>
            </div>
            <span className="text-[11px] text-[#4b5563]">
              {newContent.length}/1500 BYTES
            </span>
          </div>

          {error && (
            <div className="p-2.5 bg-[#ff5555]/10 border border-[#ff5555] text-[#ff5555] text-xs flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Add operational notes, corroborating sources, or technical analysis..."
            rows={3}
            maxLength={1500}
            required
            className="w-full bg-[#080c12] border border-[#1a2333] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] p-3 text-xs text-[#e6edf3] placeholder-[#4b5563] outline-none transition-all resize-y"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#6b7280]">
              &gt; Transmission is signed with your operator key
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !newContent.trim()}
              className="px-4 py-2 text-xs border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.15)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSubmitting ? "[TRANSMITTING...]" : "[TRANSMIT NOTE ↵]"}
              </span>
            </button>
          </div>
        </form>
      ) : (
        <div className="border border-dashed border-[#1f2638] bg-[#0c1018] p-6 text-center hud-chamfer">
          <p className="text-xs text-[#8b949e] mb-3">
            [ ACCESS RESTRICTED: OPERATOR SESSION REQUIRED TO TRANSMIT INTEL NOTES ]
          </p>
          <Link
            href={`/auth/signin?callbackUrl=/dispatch/${postId}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] hover:brightness-125 transition-all shadow-[0_0_10px_rgba(0,255,102,0.15)]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>CONNECT OPERATOR IDENTITY</span>
          </Link>
        </div>
      )}

      {/* Transmission Logs List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="p-8 border border-[#161d2b] bg-[#090d14] text-center text-[#6b7280] text-xs">
            // NO FIELD TRANSMISSIONS RECORDED. BE THE FIRST OPERATOR TO LOG
            INTEL.
          </div>
        ) : (
          comments.map((comment) => {
            const authorName =
              comment.author?.name || comment.author?.email || "anonymous_op";
            const isCurrentUser = session?.user?.id === comment.authorId;
            const canPurge = isCurrentUser || session?.user?.isAdmin;

            return (
              <div
                key={comment.id}
                className="border border-[#1a2333] bg-[#0b1018] p-4 hud-chamfer space-y-2 hover:border-[#2d3b55] transition-colors"
              >
                {/* Comment Metadata Bar */}
                <div className="flex items-center justify-between text-[11px] border-b border-[#141b27] pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[#e6edf3] font-bold">
                      <User className="w-3 h-3 text-[var(--accent)]" />
                      @{authorName}
                    </span>
                    <span
                      className={`text-[9px] px-1 py-0.2 border ${
                        comment.author?.isAdmin
                          ? "border-[#ff5555] text-[#ff5555] bg-[#ff5555]/10"
                          : "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                      }`}
                    >
                      {comment.author?.isAdmin ? "ROOT" : "OP"}
                    </span>
                    <span className="text-[#32435e]">|</span>
                    <span className="flex items-center gap-1 text-[#6b7280]">
                      <Clock className="w-3 h-3 text-[#4b5563]" />
                      {formatTerminalDate(comment.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#4b5563]">
                      #log_{comment.id.slice(-6)}
                    </span>
                    {canPurge && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="text-[#6b7280] hover:text-[#ff5555] transition-colors p-1"
                        title="Purge transmission log"
                        aria-label="Purge transmission log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment Body */}
                <div className="text-xs text-[#cad2dc] leading-relaxed whitespace-pre-line pt-1">
                  {comment.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
