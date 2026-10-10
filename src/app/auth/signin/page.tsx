"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Terminal, Shield, User, ArrowRight, GitBranch, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [customEmail, setCustomEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const handleDevSignIn = async (email: string, role: "root" | "operator") => {
    setIsLoading(true);
    setActiveRole(role);
    try {
      const result = await signIn("terminal-credentials", {
        email,
        role,
        callbackUrl,
        redirect: false,
      });

      if (result?.ok) {
        if (role === "root") {
          router.push(callbackUrl === "/" ? "/admin" : callbackUrl);
        } else {
          router.push(callbackUrl === "/" ? "/submit" : callbackUrl);
        }
        router.refresh();
      }
    } finally {
      setIsLoading(false);
      setActiveRole(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsLoading(true);
    try {
      const result = await signIn("terminal-credentials", {
        email: customEmail,
        role: "operator",
        callbackUrl,
        redirect: false,
      });
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 font-mono space-y-6">
      {/* Chassis Window */}
      <div className="border border-[#1f2937] bg-[#0c1018] shadow-[0_0_25px_rgba(0,255,102,0.15)]">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#111620] border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff5555] inline-block" />
            <span className="w-2.5 h-2.5 bg-[#ffb454] inline-block" />
            <span className="w-2.5 h-2.5 bg-[#00ff66] inline-block" />
            <span className="text-xs text-[#8b949e] ml-2">auth_terminal.sh</span>
          </div>
          <div className="text-[10px] text-[#00ff66]">CLEARANCE_PROTOCOL // v1.1</div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#00ff66]">
              <Terminal className="w-4 h-4" />
              <span>guest@sudoupdate:~$ sudo handshake --authenticate</span>
            </div>
            <h1 className="text-xl font-bold text-[#e5e7eb] tracking-tight">
              OPERATOR IDENTITY // <span className="text-[#00ff66] text-phosphor-glow">AUTHENTICATION</span>
            </h1>
            <p className="text-xs text-[#8b949e]">
              Select a clearance protocol below to establish session credentials.
            </p>
          </div>

          {/* 1-Click Fast Dev Access Box */}
          <div className="p-4 border border-[#00ff66]/40 bg-[#00ff66]/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#00ff66] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                [ FAST LOCAL TESTING BYPASS ]
              </span>
              <span className="text-[10px] bg-[#00ff66]/20 text-[#00ff66] px-1.5 py-0.5 border border-[#00ff66]/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              Instant one-click authentication bypass for immediate local testing without setting up external OAuth API keys.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDevSignIn("root@sudoupdate.dev", "root")}
                disabled={isLoading}
                className="p-3 text-left border border-[#ff5555]/50 bg-[#ff5555]/10 hover:bg-[#ff5555]/20 hover:border-[#ff5555] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#ff5555] flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    ROOT ADMIN
                  </span>
                  <span className="text-[10px] text-[#ff5555]/70">[SU]</span>
                </div>
                <div className="text-[11px] text-[#e5e7eb] truncate">root@sudoupdate.dev</div>
                <div className="text-[10px] text-[#8b949e] mt-1 group-hover:text-[#ff5555] flex items-center gap-1">
                  <span>&gt; Access /admin dashboard</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => handleDevSignIn("operator@sudoupdate.dev", "operator")}
                disabled={isLoading}
                className="p-3 text-left border border-[#00ff66]/50 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 hover:border-[#00ff66] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#00ff66] flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    FIELD OPERATOR
                  </span>
                  <span className="text-[10px] text-[#00ff66]/70">[USER]</span>
                </div>
                <div className="text-[11px] text-[#e5e7eb] truncate">operator@sudoupdate.dev</div>
                <div className="text-[10px] text-[#8b949e] mt-1 group-hover:text-[#00ff66] flex items-center gap-1">
                  <span>&gt; Access /submit portal</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Custom Email Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2">
            <label className="text-xs text-[#8b949e] block">
              Or connect as custom operator identity:
            </label>
            <div className="flex gap-2">
              <Input
                promptPrefix="identity:~$ "
                type="email"
                placeholder="agent.smith@domain.dev"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="md" isLoading={isLoading}>
                CONNECT
              </Button>
            </div>
          </form>

          {/* External Social OAuth Providers */}
          <div className="pt-4 border-t border-[#1f2937] space-y-3">
            <span className="text-[11px] text-[#6b7280] block uppercase tracking-wider">
              External Cryptographic Handshakes (Production):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => signIn("github", { callbackUrl })}
                className="w-full flex items-center justify-center gap-2 p-2.5 border border-[#374151] bg-[#111620] hover:border-[#9ca3af] hover:bg-[#1a2330] text-xs text-[#e5e7eb] transition-all cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-[#00ff66]" />
                <span>[ GITHUB OAUTH ]</span>
              </button>

              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full flex items-center justify-center gap-2 p-2.5 border border-[#374151] bg-[#111620] hover:border-[#9ca3af] hover:bg-[#1a2330] text-xs text-[#e5e7eb] transition-all cursor-pointer"
              >
                <span className="font-bold text-[#59c2ff]">G</span>
                <span>[ GOOGLE OAUTH ]</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto my-12 p-8 border border-[#1f2937] bg-[#0c1018] font-mono text-center text-[#00ff66]">
          [ INITIALIZING_AUTH_TERMINAL... ]
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
