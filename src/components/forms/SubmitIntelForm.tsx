"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PostCategory } from "@prisma/client";
import { createPostSchema } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import TerminalImage from "@/components/ui/TerminalImage";
import CategoryBadge from "@/components/ui/CategoryBadge";
import SourceBadge from "@/components/feed/SourceBadge";
import { CATEGORY_LABELS, PostWithAuthor } from "@/types";
import { Send, CheckCircle2, AlertTriangle, Sparkles, Terminal, Clock, User, ArrowRight } from "lucide-react";

export default function SubmitIntelForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>(PostCategory.TECH);
  const [imageUrl, setImageUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPayload, setSuccessPayload] = useState<any | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const categoryOptions = (Object.keys(CATEGORY_LABELS) as PostCategory[]).map(
    (cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat],
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const payload = {
      title,
      content,
      category,
      imageUrl: imageUrl.trim() || undefined,
      sourceUrl,
    };

    const result = createPostSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || "Failed to submit intelligence dispatch");
        if (data.details) {
          const detailErrors: Record<string, string> = {};
          Object.keys(data.details).forEach((k) => {
            detailErrors[k] = data.details[k][0];
          });
          setErrors(detailErrors);
        }
        return;
      }

      setSuccessPayload(data.data);
    } catch {
      setServerError("Network failure during packet transmission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successPayload) {
    return (
      <div className="border border-[var(--accent)] bg-[#0c140e] p-6 sm:p-8 space-y-4 font-mono hud-chamfer">
        <div className="flex items-center gap-3 text-[var(--accent)]">
          <CheckCircle2 className="w-8 h-8" />
          <div>
            <h2 className="text-lg font-bold">[ TRANSMISSION_ACK: 201_CREATED ]</h2>
            <p className="text-xs text-[#8b949e]">PACKET ID: {successPayload.id}</p>
          </div>
        </div>

        <div className="p-4 bg-[#070b08] border border-[#1f2937] text-xs text-[#9ca3af] space-y-1">
          <div>&gt; STATUS: [PENDING_ROOT_VERIFICATION]</div>
          <div>&gt; HEADLINE: {successPayload.title}</div>
          <div>&gt; CATEGORY: {successPayload.category}</div>
          <div>&gt; QUEUE: Moderation Buffer</div>
        </div>

        <p className="text-xs text-[#8b949e]">
          Your dispatch has entered the root moderation buffer. Once inspected and authorized by root, it will be mirrored to the live public dispatches feed.
        </p>

        <div className="flex items-center gap-3 pt-3">
          <Button
            variant="primary"
            onClick={() => {
              setTitle("");
              setContent("");
              setImageUrl("");
              setSourceUrl("");
              setSuccessPayload(null);
            }}
          >
            TRANSMIT ANOTHER PACKET
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            RETURN TO FEED
          </Button>
        </div>
      </div>
    );
  }

  // Real-time Mock Card for live preview
  const previewAuthor = session?.user?.name || session?.user?.email || "current_operator";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono items-start">
      {/* Form Column */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        {serverError && (
          <div className="p-3 bg-[#ff5555]/10 border border-[#ff5555] text-[#ff5555] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Headline Title */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
            Dispatch Headline <span className="text-[var(--accent)]">*</span>
          </label>
          <Input
            promptPrefix="headline:~$ "
            placeholder="e.g. Next.js 16 Drops Turbopack Build Times by 40%"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            maxLength={160}
            required
          />
        </div>

        {/* Category & Source Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
              Intelligence Category <span className="text-[var(--accent)]">*</span>
            </label>
            <Select
              promptPrefix="tag:~$ "
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              error={errors.category}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
              Source Reference Link <span className="text-[var(--accent)]">*</span>
            </label>
            <Input
              promptPrefix="src:~$ "
              type="url"
              placeholder="https://example.com/press-release"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              error={errors.sourceUrl}
              required
            />
          </div>
        </div>

        {/* Thumbnail Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
            Thumbnail Graphic URL (Optional)
          </label>
          <Input
            promptPrefix="media:~$ "
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            error={errors.imageUrl}
          />
        </div>

        {/* Intel Content Body */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
            Intelligence Briefing / Body <span className="text-[var(--accent)]">*</span>
          </label>
          <Textarea
            promptPrefix="cat << INTEL_PAYLOAD"
            placeholder="Detailed briefing, key takeaways, and breakdown of the dispatch..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={errors.content}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#4b5563]">
            &gt; Transmits to root buffer
          </span>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            DISPATCH PACKET
          </Button>
        </div>
      </form>

      {/* Split-Screen Live Preview Column */}
      <div className="lg:col-span-5 space-y-3 sticky top-24">
        <div className="flex items-center justify-between text-xs text-[#8b949e] px-1">
          <span className="flex items-center gap-1.5 text-[var(--accent)] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE_HUD_SIMULATION
          </span>
          <span className="text-[10px] text-[#4b5563]">[REAL-TIME PREVIEW]</span>
        </div>

        {/* Simulated Post Card */}
        <div className="bg-[#0d131d] border border-[var(--accent)]/60 shadow-[0_0_20px_rgba(0,255,102,0.1)] hud-chamfer overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#101724] border-b border-[#1d273a] text-[11px] text-[#8b949e]">
            <div className="flex items-center gap-2">
              <CategoryBadge category={category} />
              <span className="text-[#32435e]">|</span>
              <span className="flex items-center gap-1 text-[#6b7280]">
                <Clock className="w-3 h-3 text-[#4b5563]" />
                JUST NOW
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#9ca3af]">
              <User className="w-3 h-3 text-[var(--accent)]" />
              <span className="truncate max-w-[100px]">@{previewAuthor}</span>
            </div>
          </div>

          {/* Media preview */}
          <TerminalImage
            src={imageUrl || null}
            alt={title || "Preview image"}
            aspectRatio="video"
          />

          {/* Body */}
          <div className="p-4 space-y-3">
            <h3 className="text-base font-bold text-[#e6edf3] line-clamp-2 leading-snug">
              {title || "[DISPATCH_HEADLINE_PLACEHOLDER]"}
            </h3>

            <p className="text-xs text-[#8b949e] line-clamp-3 leading-relaxed whitespace-pre-line">
              {content || "Detailed intelligence body and findings will render here in real-time as you compose your payload..."}
            </p>

            <div className="pt-3 border-t border-[#1d273a] flex items-center justify-between">
              <span className="text-xs border border-[#374151] px-2 py-0.5 text-[#9ca3af]">
                [ ▲ 0 SIGNAL ]
              </span>
              <SourceBadge url={sourceUrl || "https://example.com"} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#0c1018] border border-[#1f2937] text-[11px] text-[#6b7280] space-y-1">
          <div>&gt; VERIFICATION: Strict URL protocol validation</div>
          <div>&gt; CACHE_TAG: Tagged 'posts' upon root approval</div>
        </div>
      </div>
    </div>
  );
}
