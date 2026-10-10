"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCategory } from "@prisma/client";
import { CATEGORY_LABELS } from "@/types";
import { Flame, Clock } from "lucide-react";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort") || "latest";

  const categories = Object.keys(CATEGORY_LABELS) as PostCategory[];

  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSortSelect = (sort: "latest" | "top") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-[#8b949e] mr-1 hidden sm:inline select-none">
          TOPIC:
        </span>
        <button
          onClick={() => handleCategorySelect(null)}
          className={`px-2.5 py-1 text-xs font-mono border transition-all select-none cursor-pointer ${
            !currentCategory
              ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_8px_rgba(0,255,102,0.25)]"
              : "border-[#1f2937] text-[#9ca3af] hover:text-[#00ff66] hover:border-[#374151]"
          }`}
        >
          [ALL]
        </button>

        {categories.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-2.5 py-1 text-xs font-mono border transition-all whitespace-nowrap select-none cursor-pointer ${
                isSelected
                  ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_8px_rgba(0,255,102,0.25)]"
                  : "border-[#1f2937] text-[#9ca3af] hover:text-[#00ff66] hover:border-[#374151]"
              }`}
            >
              [{CATEGORY_LABELS[cat]}]
            </button>
          );
        })}
      </div>

      {/* Sort Switcher */}
      <div className="flex items-center gap-1.5 shrink-0 select-none">
        <span className="text-xs font-mono text-[#8b949e] mr-1 hidden sm:inline">
          RANKING:
        </span>
        <button
          onClick={() => handleSortSelect("latest")}
          className={`px-2.5 py-1 text-xs font-mono border transition-all flex items-center gap-1 cursor-pointer ${
            currentSort === "latest"
              ? "border-[#59c2ff] text-[#59c2ff] bg-[#59c2ff]/10"
              : "border-[#1f2937] text-[#9ca3af] hover:text-[#59c2ff]"
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>[LATEST]</span>
        </button>

        <button
          onClick={() => handleSortSelect("top")}
          className={`px-2.5 py-1 text-xs font-mono border transition-all flex items-center gap-1 cursor-pointer ${
            currentSort === "top"
              ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_8px_rgba(0,255,102,0.25)]"
              : "border-[#1f2937] text-[#9ca3af] hover:text-[#00ff66]"
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>[TOP SIGNAL]</span>
        </button>
      </div>
    </div>
  );
}
