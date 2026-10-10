"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radio, X, Sparkles } from "lucide-react";

interface TickerItem {
  id: string;
  category: string;
  title: string;
}

interface BroadcastTickerProps {
  items?: TickerItem[];
}

const DEFAULT_ITEMS: TickerItem[] = [
  {
    id: "cmv2pm43o0002joizgulo4o12",
    category: "TECH",
    title: "Linux Kernel 6.14 Merges Real-Time PREEMPT_RT Mainline Support",
  },
  {
    id: "cmv2pm4jy0004joiz9afsfrwt",
    category: "AI",
    title: "DeepMind Open-Sources AlphaGeometry 2 Verification Weights",
  },
  {
    id: "cmv2pm6cr000cjoizlowhxn28",
    category: "GLOBAL",
    title: "Subsea Quantum Key Distribution Cable Established Across English Channel",
  },
  {
    id: "cmv2pm5050006joiz0nk4xkod",
    category: "ESPORTS",
    title: "VCT Champions Grand Finals Smashes Global Peak Concurrent Viewership",
  },
];

export default function BroadcastTicker({ items = DEFAULT_ITEMS }: BroadcastTickerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || items.length === 0) return null;

  return (
    <div className="border-b border-[#1f2638] bg-[#070b12] text-xs font-mono select-none overflow-hidden relative">
      <div className="flex items-center">
        {/* Static Prefix Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0e1624] border-r border-[#1f2638] text-[var(--accent)] shrink-0 z-10 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
          <span className="font-extrabold tracking-wider text-[11px] text-phosphor-glow hidden sm:inline">
            NETWORK_BROADCAST
          </span>
          <span className="font-extrabold tracking-wider text-[11px] sm:hidden">
            LIVE
          </span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="flex-1 overflow-hidden relative whitespace-nowrap py-1.5 group">
          <div className="inline-block animate-marquee group-hover:[animation-play-state:paused] text-[11px]">
            {items.concat(items).map((item, idx) => (
              <span key={`${item.id}-${idx}`} className="inline-flex items-center mx-6">
                <span className="text-[#00f0ff] font-bold mr-1.5">
                  [#{item.category}]
                </span>
                <Link
                  href={`/dispatch/${item.id}`}
                  className="text-[#cad2dc] hover:text-[var(--accent)] transition-colors hover:underline"
                >
                  {item.title}
                </Link>
                <span className="text-[#32435e] mx-4 select-none">///</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="px-2 py-1.5 text-[#6b7280] hover:text-[#ff5555] transition-colors border-l border-[#1f2638] bg-[#070b12] z-10 shrink-0 cursor-pointer"
          title="Dismiss Live Broadcast"
          aria-label="Dismiss Live Broadcast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
