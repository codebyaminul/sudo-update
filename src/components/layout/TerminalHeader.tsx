"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Terminal, Shield, PlusCircle, LogIn, LogOut, Radio } from "lucide-react";

export default function TerminalHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "DISPATCHES", icon: Radio },
    { href: "/submit", label: "SUBMIT INTEL", icon: PlusCircle },
  ];

  if (session?.user?.isAdmin) {
    navLinks.push({ href: "/admin", label: "ROOT ADMIN", icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f2937] bg-[#0a0e14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Prompt */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#00ff66] font-mono font-bold tracking-wider hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-none border border-[#00ff66]/50 bg-[#00ff66]/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#00ff66]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base text-phosphor-glow">sudo update</span>
                <span className="text-[10px] text-[#4b5563] tracking-widest font-normal">
                  COMMUNITY_INTEL_NETWORK
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider border transition-all duration-150 ${
                    isActive
                      ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                      : "border-transparent text-[#9ca3af] hover:text-[#00ff66] hover:border-[#1f2937]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>[{link.label}]</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <span className="text-xs font-mono text-[#8b949e] animate-pulse">
                [ AUTH_SYNC... ]
              </span>
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-mono text-[#e5e7eb]">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-[10px] font-mono text-[#00ff66]/80 flex items-center justify-end gap-1">
                    {session.user.isAdmin ? (
                      <span className="text-[#ff5555] font-bold">[ROOT]</span>
                    ) : (
                      <span>[OPERATOR]</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-2.5 py-1 text-xs font-mono border border-[#374151] text-[#9ca3af] hover:text-[#ff5555] hover:border-[#ff5555] transition-colors flex items-center gap-1"
                  title="Disconnect session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">[LOGOUT]</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-3 py-1.5 text-xs font-mono border border-[#00ff66]/60 text-[#00ff66] bg-[#00ff66]/10 hover:bg-[#00ff66]/20 hover:border-[#00ff66] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(0,255,102,0.2)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>[CONNECT]</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
