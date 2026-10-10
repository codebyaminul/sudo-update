import React from "react";
import { ExternalLink } from "lucide-react";
import { extractHost } from "@/lib/utils";

interface SourceBadgeProps {
  url: string;
  className?: string;
}

export default function SourceBadge({ url, className = "" }: SourceBadgeProps) {
  const host = extractHost(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono border border-[#374151] bg-[#11161f] text-[#59c2ff] hover:text-[#00ff66] hover:border-[#00ff66]/50 transition-colors ${className}`}
      title={`Open original source: ${url}`}
    >
      <span>src:</span>
      <span className="font-semibold underline decoration-dotted underline-offset-2">
        {host}
      </span>
      <ExternalLink className="w-3 h-3 opacity-70" />
    </a>
  );
}
