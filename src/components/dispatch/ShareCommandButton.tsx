"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareCommandButtonProps {
  postId: string;
}

export default function ShareCommandButton({ postId }: ShareCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/dispatch/${postId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs border font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
        copied
          ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] shadow-[0_0_8px_rgba(0,255,102,0.3)]"
          : "border-[#232f42] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#3b4c68] bg-[#0c1018]"
      }`}
      title="Copy link to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>[ LINK_COPIED ]</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>[ SHARE_LINK ]</span>
        </>
      )}
    </button>
  );
}
