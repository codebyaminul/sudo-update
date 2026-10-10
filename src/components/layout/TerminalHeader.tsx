"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Terminal,
  Shield,
  PlusCircle,
  LogIn,
  LogOut,
  Radio,
  Tv,
  Command,
  Palette,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTheme, TerminalTheme } from "@/components/layout/ThemeContext";
import { soundEngine } from "@/lib/sound";

export default function TerminalHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, setTheme, scanlines, toggleScanlines } = useTheme();
  const [timecode, setTimecode] = useState("");
  const [sfxEnabled, setSfxEnabled] = useState(true);

  useEffect(() => {
    setSfxEnabled(soundEngine.isEnabled());
    const updateClock = () => {
      const now = new Date();
      setTimecode(now.toISOString().substring(11, 19) + "Z");
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { href: "/", label: "DISPATCHES", icon: Radio },
    { href: "/submit", label: "SUBMIT INTEL", icon: PlusCircle },
  ];

  if (session?.user?.isAdmin) {
    navLinks.push({ href: "/admin", label: "ROOT ADMIN", icon: Shield });
  }

  const themes: { id: TerminalTheme; label: string; dotColor: string }[] = [
    { id: "matrix", label: "MATRIX", dotColor: "#00ff66" },
    { id: "amber", label: "AMBER", dotColor: "#ffb454" },
    { id: "cyan", label: "CYAN", dotColor: "#00f0ff" },
    { id: "synthwave", label: "NEON", dotColor: "#ff007f" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f2638] bg-[#0a0e14]/95 backdrop-blur-md font-mono select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo / Prompt */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[var(--accent)] font-bold tracking-wider hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 border border-[var(--accent)] bg-[var(--accent-muted)] flex items-center justify-center hud-chamfer-top">
                <Terminal className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-phosphor-glow">
                  sudo update
                </span>
                <span className="text-[9px] text-[#8b949e] tracking-widest font-normal uppercase">
                  COMMUNITY_INTEL_NET
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider border transition-all duration-150 ${
                    isActive
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                      : "border-transparent text-[#8b949e] hover:text-[var(--accent)] hover:border-[#1f2638]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>[{link.label}]</span>
                </Link>
              );
            })}
          </nav>

          {/* HUD Utility Bar: Clock, Themes, Scanline, Auth */}
          <div className="flex items-center gap-2">
            {/* Live Clock Ticker */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-[11px] text-[#6b7280] border border-[#1a2232] bg-[#0c1018]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>{timecode || "00:00:00Z"}</span>
            </div>

            {/* Quick Command Palette Button */}
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  ctrlKey: true,
                });
                window.dispatchEvent(event);
              }}
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] border border-[#27354a] bg-[#0e1420] text-[#8b949e] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-3 h-3" />
              <span>HUD</span>
              <kbd className="text-[9px] text-[#4b5563] ml-0.5">^K</kbd>
            </button>

            {/* Scanline CRT Toggle */}
            <button
              onClick={toggleScanlines}
              className={`p-1.5 text-xs border transition-colors cursor-pointer ${
                scanlines
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[#27354a] text-[#4b5563] hover:text-[#8b949e]"
              }`}
              title={`Toggle CRT Scanlines (${scanlines ? "ON" : "OFF"})`}
              aria-label="Toggle CRT Scanlines"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            {/* Synthesizer Audio SFX Toggle */}
            <button
              onClick={() => {
                const next = soundEngine.toggle();
                setSfxEnabled(next);
              }}
              className={`p-1.5 text-xs border transition-colors cursor-pointer ${
                sfxEnabled
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[#27354a] text-[#4b5563] hover:text-[#8b949e]"
              }`}
              title={`Terminal Synthesizer Audio (${sfxEnabled ? "ON" : "MUTED"})`}
              aria-label="Toggle Terminal Synthesizer Audio"
            >
              {sfxEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Phosphor Theme Switcher */}
            <div className="flex items-center border border-[#1f2638] bg-[#0c1018] p-0.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEngine.playThemeSwitch();
                    setTheme(t.id);
                  }}
                  aria-label={`Switch to ${t.label} theme`}
                  className={`w-5 h-5 flex items-center justify-center transition-all cursor-pointer ${
                    theme === t.id
                      ? "bg-black/60 shadow-[0_0_8px_rgba(255,255,255,0.2)] border border-[var(--accent)]"
                      : "opacity-40 hover:opacity-80"
                  }`}
                  title={`${t.label} Phosphor CRT`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-none"
                    style={{ backgroundColor: t.dotColor }}
                  />
                </button>
              ))}
            </div>

            {/* Auth Controls */}
            {status === "loading" ? (
              <span className="text-xs text-[#8b949e] animate-pulse">
                [ AUTH... ]
              </span>
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="hidden sm:flex flex-col text-right hover:opacity-85 transition-opacity"
                  title="Inspect Operator Dossier"
                >
                  <span className="text-xs text-[#e6edf3]">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-[9px] text-[var(--accent)] font-bold">
                    {session.user.isAdmin ? "[ROOT_ADMIN]" : "[OPERATOR]"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-2.5 py-1 text-xs border border-[#374151] text-[#9ca3af] hover:text-[#ff5555] hover:border-[#ff5555] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Disconnect session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">[EXIT]</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-3 py-1.5 text-xs border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-muted)] hover:brightness-125 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.15)]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>[CONNECT]</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
