"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, Zap } from "lucide-react";

interface BoostButtonProps {
  postId: string;
  initialCount?: number;
  initialHasBoosted?: boolean;
}

export default function BoostButton({
  postId,
  initialCount = 0,
  initialHasBoosted = false,
}: BoostButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [count, setCount] = useState(initialCount);
  const [hasBoosted, setHasBoosted] = useState(initialHasBoosted);
  const [isPending, setIsPending] = useState(false);

  const handleToggleBoost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/`);
      return;
    }

    if (isPending) return;

    // Optimistic state transition
    const previousState = hasBoosted;
    const previousCount = count;
    const nextState = !previousState;
    const nextCount = nextState ? previousCount + 1 : Math.max(0, previousCount - 1);

    setHasBoosted(nextState);
    setCount(nextCount);
    setIsPending(true);

    try {
      const res = await fetch(`/api/posts/${postId}/boost`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback
        setHasBoosted(previousState);
        setCount(previousCount);
      } else {
        setCount(data.totalBoosts);
        setHasBoosted(data.hasBoosted);
      }
    } catch {
      setHasBoosted(previousState);
      setCount(previousCount);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggleBoost}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border transition-all duration-150 cursor-pointer select-none active:scale-95 ${
        hasBoosted
          ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/15 shadow-[0_0_10px_rgba(0,255,102,0.3)] text-phosphor-glow"
          : "border-[#374151] text-[#9ca3af] bg-[#0b1017] hover:border-[#00ff66]/60 hover:text-[#00ff66] hover:bg-[#111722]"
      }`}
      title={hasBoosted ? "Recall signal boost" : "Amplify signal boost"}
    >
      <ArrowBigUp
        className={`w-4 h-4 transition-transform ${
          hasBoosted ? "fill-[#00ff66] text-[#00ff66] scale-110" : "text-current"
        }`}
      />
      <span className="font-bold">{count}</span>
      <span className="text-[10px] opacity-75 tracking-wider hidden sm:inline">SIGNAL</span>
    </button>
  );
}
