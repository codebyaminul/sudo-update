"use client";

import React, { useState } from "react";
import { PostWithAuthor } from "@/types";
import { PostStatus, PostCategory } from "@prisma/client";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import CategoryBadge from "@/components/ui/CategoryBadge";
import TerminalImage from "@/components/ui/TerminalImage";
import SourceBadge from "@/components/feed/SourceBadge";
import EditPostModal from "@/components/admin/EditPostModal";
import { formatTerminalDate } from "@/lib/utils";
import { Check, X, Edit3, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";

interface ModerationTableProps {
  initialPosts: PostWithAuthor[];
}

export default function ModerationTable({
  initialPosts,
}: ModerationTableProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts);
  const [activeEditingPost, setActiveEditingPost] = useState<PostWithAuthor | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAction = async (id: string, status: PostStatus) => {
    setLoadingId(id);
    setNotification(null);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setNotification({
          type: "error",
          message: data.error || `Failed to set post status to ${status}`,
        });
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== id));
      setNotification({
        type: "success",
        message: `Dispatch ${id.slice(-6)} successfully marked as [${status}]. Public feed cache refreshed.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Network fault encountered during moderation dispatch.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleSaveEdit = async (updatedData: {
    title: string;
    content: string;
    category: PostCategory;
  }) => {
    if (!activeEditingPost) return;
    const id = activeEditingPost.id;
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: PostStatus.PENDING,
          ...updatedData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setNotification({
          type: "error",
          message: data.error || "Failed to update post content",
        });
        return;
      }

      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
      setNotification({
        type: "success",
        message: `Dispatch ${id.slice(-6)} payload updated in queue buffer.`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Failed to persist modifications.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 border text-xs flex items-center justify-between ${
            notification.type === "success"
              ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
              : "bg-[#ff5555]/10 border-[#ff5555] text-[#ff5555]"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs uppercase hover:underline opacity-80"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="border border-dashed border-[#1f2937] bg-[#0c1018] p-12 text-center">
          <p className="text-sm text-[#00ff66] font-bold">
            [ MODERATION_BUFFER_CLEAR: ZERO_PENDING_DISPATCHES ]
          </p>
          <p className="text-xs text-[#8b949e] mt-2">
            All submitted intelligence packets have been triaged by root. New submissions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="border border-[#1f2638] overflow-x-auto bg-[#0c1018] hud-chamfer">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1f2937] bg-[#111620] text-[#8b949e] uppercase tracking-wider">
                <th className="p-3 w-16">Preview</th>
                <th className="p-3">Headline & Source</th>
                <th className="p-3">Category</th>
                <th className="p-3">Submitter</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {posts.map((post) => {
                const isItemLoading = loadingId === post.id;
                const authorDisplay =
                  post.author?.name || post.author?.email || "anon_op";

                return (
                  <tr
                    key={post.id}
                    className="hover:bg-[#131924] transition-colors"
                  >
                    {/* Media Preview */}
                    <td className="p-3 align-top">
                      <div className="w-16 h-12">
                        <TerminalImage
                          src={post.imageUrl}
                          alt="thumbnail"
                          aspectRatio="video"
                        />
                      </div>
                    </td>

                    {/* Headline, Content & Source */}
                    <td className="p-3 align-top max-w-md">
                      <div className="font-bold text-[#e5e7eb] mb-1">
                        {post.title}
                      </div>
                      <p className="text-[#8b949e] text-[11px] line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      <SourceBadge url={post.sourceUrl} />
                    </td>

                    {/* Category */}
                    <td className="p-3 align-top whitespace-nowrap">
                      <CategoryBadge category={post.category} />
                    </td>

                    {/* Submitter */}
                    <td className="p-3 align-top whitespace-nowrap text-[#9ca3af]">
                      @{authorDisplay}
                    </td>

                    {/* Timestamp */}
                    <td className="p-3 align-top whitespace-nowrap text-[#6b7280]">
                      {formatTerminalDate(post.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="p-3 align-top whitespace-nowrap">
                      <StatusBadge status={post.status} />
                    </td>

                    {/* Actions */}
                    <td className="p-3 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAction(post.id, PostStatus.APPROVED)}
                          disabled={isItemLoading}
                          title="Approve & Publish to Public Feed"
                        >
                          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                          <span>APPROVE</span>
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setActiveEditingPost(post)}
                          disabled={isItemLoading}
                          title="Edit Headline/Content"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#59c2ff]" />
                          <span>EDIT</span>
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAction(post.id, PostStatus.REJECTED)}
                          disabled={isItemLoading}
                          title="Reject and drop packet"
                        >
                          <X className="w-3.5 h-3.5 text-[#ff5555]" />
                          <span>REJECT</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline Edit Modal */}
      {activeEditingPost && (
        <EditPostModal
          post={activeEditingPost}
          isOpen={Boolean(activeEditingPost)}
          onClose={() => setActiveEditingPost(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
