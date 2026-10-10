"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PostCategory } from "@prisma/client";
import { createPostSchema } from "@/lib/validations";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import TerminalImage from "@/components/ui/TerminalImage";
import { CATEGORY_LABELS } from "@/types";
import { Send, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function SubmitIntelForm() {
  const router = useRouter();

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
      <div className="border border-[#00ff66]/60 bg-[#0c140e] p-6 sm:p-8 space-y-4 font-mono">
        <div className="flex items-center gap-3 text-[#00ff66]">
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
          Your dispatch has entered the root moderation buffer. Once inspected and authorized by a root administrator, it will be mirrored to the live public dispatches feed.
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono">
      {serverError && (
        <div className="p-3 bg-[#ff5555]/10 border border-[#ff5555] text-[#ff5555] text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Headline Title */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
          Dispatch Headline <span className="text-[#00ff66]">*</span>
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
            Intelligence Category <span className="text-[#00ff66]">*</span>
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
            Source Reference Link <span className="text-[#00ff66]">*</span>
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

      {/* Thumbnail Image URL & Preview */}
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

        {imageUrl && (
          <div className="mt-3 max-w-sm">
            <span className="text-[10px] text-[#4b5563] mb-1 block uppercase">
              Payload Media Preview:
            </span>
            <TerminalImage src={imageUrl} alt="Thumbnail preview" />
          </div>
        )}
      </div>

      {/* Intel Content Body */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8b949e] uppercase tracking-wider block">
          Intelligence Briefing / Body <span className="text-[#00ff66]">*</span>
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
          &gt; All submissions subject to root review
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
  );
}
