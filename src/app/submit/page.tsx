import React from "react";
import { getCurrentUser } from "@/lib/auth-utils";
import SubmitIntelForm from "@/components/forms/SubmitIntelForm";
import { ShieldAlert, Terminal, Lock } from "lucide-react";
import Link from "next/link";

export default async function SubmitPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 border border-[#ff5555]/50 bg-[#120a0d] font-mono text-center space-y-4">
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
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono hover:bg-[#00ff66]/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.2)]"
          >
            <span>[ INITIATE OAUTH HANDSHAKE ]</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="border border-[#1f2937] bg-[#0c1018] p-4 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] mb-2">
          <Terminal className="w-4 h-4" />
          <span>operator@{user.name || user.email}:~$ sudo intel --submit</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#e5e7eb] tracking-tight">
          INTEL DISPATCH // <span className="text-[#00ff66]">SUBMISSION PORTAL</span>
        </h1>
        <p className="text-xs font-mono text-[#8b949e] mt-1">
          Submit community intelligence with reference links. All packets are held in the pending queue until approved by root.
        </p>
      </div>

      {/* Form Container */}
      <div className="border border-[#1f2937] bg-[#0d121a] p-4 sm:p-6">
        <SubmitIntelForm />
      </div>
    </div>
  );
}
