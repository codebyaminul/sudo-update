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
    TECH: "text-[#59c2ff] border-[#59c2ff]/40 bg-[#59c2ff]/10",
    AI: "text-[#00ff66] border-[#00ff66]/40 bg-[#00ff66]/10",
    ESPORTS: "text-[#ff79c6] border-[#ff79c6]/40 bg-[#ff79c6]/10",
    CINEMA: "text-[#ffb454] border-[#ffb454]/40 bg-[#ffb454]/10",
    SPORTS: "text-[#bd93f9] border-[#bd93f9]/40 bg-[#bd93f9]/10",
    GLOBAL_NEWS: "text-[#f1fa8c] border-[#f1fa8c]/40 bg-[#f1fa8c]/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border select-none",
        colorMap[category] || "text-[#9ca3af] border-[#374151] bg-[#11161f]",
        className
      )}
    >
      #{category}
    </span>
  );
}
