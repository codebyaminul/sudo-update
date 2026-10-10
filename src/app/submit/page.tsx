import React from "react";
import { getCurrentUser } from "@/lib/auth-utils";
import SubmitIntelForm from "@/components/forms/SubmitIntelForm";
import { ShieldAlert, Terminal, Lock } from "lucide-react";
import Link from "next/link";

export default async function SubmitPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 border border-[#ff5555]/50 bg-[#120a0d] font-mono text-center space-y-4 hud-chamfer">
        <div className="w-12 h-12 mx-auto border border-[#ff5555] bg-[#ff5555]/10 flex items-center justify-center text-[#ff5555]">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="text-lg font-bold text-[#ff5555] tracking-wide">
          [ ACCESS_DENIED: AUTHENTICATION_REQUIRED ]
        </h1>

        <p className="text-xs text-[#9ca3af] leading-relaxed">
          The Intel Submission Portal requires verified operator credentials. Anonymous dispatches are blocked by protocol policy to preserve system integrity.
        </p>

        <div className="pt-2">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] text-xs font-mono hover:brightness-125 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.2)]"
          >
            <span>[ INITIATE CREDENTIALS HANDSHAKE ]</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="border border-[#1f2638] bg-[#0c1018] p-4 sm:p-6 hud-chamfer-top">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] mb-2">
          <Terminal className="w-4 h-4" />
          <span>operator@{user.name || user.email}:~$ sudo intel --submit --mode=live</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#e6edf3] tracking-tight">
          INTEL DISPATCH // <span className="text-[var(--accent)] text-phosphor-glow">SUBMISSION PORTAL</span>
        </h1>
        <p className="text-xs font-mono text-[#8b949e] mt-1">
          Compose your intelligence dispatch with live real-time HUD rendering. Packets are held in the moderation buffer for root review.
        </p>
      </div>

      {/* Form Container */}
      <div className="border border-[#1f2638] bg-[#0d121a] p-4 sm:p-6 hud-chamfer">
        <SubmitIntelForm />
      </div>
    </div>
  );
}
