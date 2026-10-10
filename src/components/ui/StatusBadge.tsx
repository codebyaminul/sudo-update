import React from "react";
import { PostStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    PENDING: "text-[#ffb454] border-[#ffb454]/40 bg-[#ffb454]/10",
    APPROVED: "text-[#00ff66] border-[#00ff66]/40 bg-[#00ff66]/10",
    REJECTED: "text-[#ff5555] border-[#ff5555]/40 bg-[#ff5555]/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border select-none",
        styles[status],
        className
      )}
    >
      [{status}]
    </span>
  );
}
