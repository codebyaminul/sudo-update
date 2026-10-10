import React from "react";
import { PostCategory } from "@prisma/client";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: PostCategory;
  className?: string;
}

export default function CategoryBadge({
  category,
  className,
}: CategoryBadgeProps) {
  const colorMap: Record<PostCategory, string> = {
    TECH: "text-[#00f0ff] border-[#00f0ff]/50 bg-[#00f0ff]/10 shadow-[0_0_8px_rgba(0,240,255,0.2)]",
    AI: "text-[#00ff66] border-[#00ff66]/50 bg-[#00ff66]/10 shadow-[0_0_8px_rgba(0,255,102,0.2)]",
    ESPORTS: "text-[#ff007f] border-[#ff007f]/50 bg-[#ff007f]/10 shadow-[0_0_8px_rgba(255,0,127,0.2)]",
    CINEMA: "text-[#ffb454] border-[#ffb454]/50 bg-[#ffb454]/10 shadow-[0_0_8px_rgba(255,180,84,0.2)]",
    SPORTS: "text-[#bd93f9] border-[#bd93f9]/50 bg-[#bd93f9]/10 shadow-[0_0_8px_rgba(189,147,249,0.2)]",
    GLOBAL_NEWS: "text-[#f1fa8c] border-[#f1fa8c]/50 bg-[#f1fa8c]/10 shadow-[0_0_8px_rgba(241,250,140,0.2)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border select-none font-bold",
        colorMap[category] || "text-[#9ca3af] border-[#374151] bg-[#11161f]",
        className
      )}
    >
      #{category}
    </span>
  );
}
