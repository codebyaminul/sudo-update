"use client";

import React, { useState } from "react";
import { PostWithAuthor, CATEGORY_LABELS } from "@/types";
import { PostCategory } from "@prisma/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { X, Save } from "lucide-react";

interface EditPostModalProps {
  post: PostWithAuthor;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    title: string;
    content: string;
    category: PostCategory;
  }) => Promise<void>;
}

export default function EditPostModal({
  post,
  isOpen,
  onClose,
  onSave,
}: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState<PostCategory>(post.category);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const categoryOptions = (Object.keys(CATEGORY_LABELS) as PostCategory[]).map(
    (cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat],
    })
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ title, content, category });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div className="w-full max-w-2xl bg-[#0d121a] border border-[#00ff66]/70 shadow-[0_0_25px_rgba(0,255,102,0.2)]">
        {/* Modal Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#111620] border-b border-[#1f2937]">
          <div className="flex items-center gap-2 text-xs text-[#00ff66]">
            <span className="w-2 h-2 bg-[#00ff66] inline-block animate-pulse" />
            <span>ROOT_OVERRIDE_EDITOR // ID: {post.id.slice(-6)}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-[#ff5555] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#8b949e]">Headline Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#8b949e]">Category</label>
            <Select
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#8b949e]">Content Briefing</label>
            <Textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="pt-3 border-t border-[#1f2937] flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={onClose}>
              ABORT
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              <Save className="w-4 h-4" />
              SAVE & STAGE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
