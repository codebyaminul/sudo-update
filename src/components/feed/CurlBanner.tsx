"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Keyboard } from "lucide-react";

export default function CurlBanner() {
  const [copied, setCopied] = useState(false);

  const command = "curl -s https://sudo-update.vercel.app/api/feed";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0a0f18] border border-[#1b263b] text-xs font-mono select-none hud-chamfer">
      <div className="flex items-center gap-2.5 overflow-x-auto">
        <div className="w-6 h-6 border border-[var(--accent)] bg-[var(--accent-muted)] flex items-center justify-center shrink-0">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[#6b7280]">STREAM IN CLI:</span>
          <code className="text-[var(--accent)] font-bold bg-[#070b12] px-2 py-0.5 border border-[#162030] text-[11px]">
            {command}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          onClick={handleCopy}
          className={`px-2.5 py-1 text-[11px] border transition-all flex items-center gap-1.5 cursor-pointer ${
            copied
              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] shadow-[0_0_8px_rgba(0,255,102,0.3)]"
              : "border-[#24334a] text-[#8b949e] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-[#0d1422]"
          }`}
          title="Copy curl command"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[var(--accent)]" />
              <span>[COPIED]</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>[COPY CLI]</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
