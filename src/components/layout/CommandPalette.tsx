"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme, TerminalTheme } from "@/components/layout/ThemeContext";
import {
  Terminal,
  Compass,
  PlusCircle,
  Shield,
  Palette,
  Tv,
  X,
  Search,
  ArrowRight,
} from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme, setTheme, scanlines, toggleScanlines } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands = [
    {
      id: "nav-feed",
      label: "Navigate: Public Dispatches Feed",
      category: "Navigation",
      icon: Compass,
      action: () => router.push("/"),
    },
    {
      id: "nav-submit",
      label: "Navigate: Submit Intel Packet",
      category: "Navigation",
      icon: PlusCircle,
      action: () => router.push("/submit"),
    },
    {
      id: "nav-admin",
      label: "Navigate: Root Moderation Buffer",
      category: "Navigation",
      icon: Shield,
      action: () => router.push("/admin"),
    },
    {
      id: "nav-profile",
      label: "Navigate: Operator Identity Dossier (/profile)",
      category: "Navigation",
      icon: Compass,
      action: () => router.push("/profile"),
    },
    {
      id: "api-feed",
      label: "CLI Command: Stream Real-Time Dispatches (/api/feed)",
      category: "Developer",
      icon: Terminal,
      action: () => window.open("/api/feed", "_blank"),
    },
    {
      id: "cat-tech",
      label: "Filter: #TECH Dispatches",
      category: "Filter",
      icon: Terminal,
      action: () => router.push("/?category=TECH"),
    },
    {
      id: "cat-ai",
      label: "Filter: #AI Dispatches",
      category: "Filter",
      icon: Terminal,
      action: () => router.push("/?category=AI"),
    },
    {
      id: "cat-esports",
      label: "Filter: #ESPORTS Dispatches",
      category: "Filter",
      icon: Terminal,
      action: () => router.push("/?category=ESPORTS"),
    },
    {
      id: "cat-cinema",
      label: "Filter: #CINEMA Dispatches",
      category: "Filter",
      icon: Terminal,
      action: () => router.push("/?category=CINEMA"),
    },
    {
      id: "theme-matrix",
      label: "Phosphor CRT: Matrix Green (Default)",
      category: "Theme",
      icon: Palette,
      action: () => setTheme("matrix"),
    },
    {
      id: "theme-amber",
      label: "Phosphor CRT: Vintage Amber (IBM 80s)",
      category: "Theme",
      icon: Palette,
      action: () => setTheme("amber"),
    },
    {
      id: "theme-cyan",
      label: "Phosphor CRT: Cyberpunk Ice Cyan",
      category: "Theme",
      icon: Palette,
      action: () => setTheme("cyan"),
    },
    {
      id: "theme-synthwave",
      label: "Phosphor CRT: Synthwave Neon Magenta",
      category: "Theme",
      icon: Palette,
      action: () => setTheme("synthwave"),
    },
    {
      id: "toggle-scan",
      label: `CRT Scanlines: ${scanlines ? "Disable Scanlines" : "Enable Scanlines"}`,
      category: "Display",
      icon: Tv,
      action: () => toggleScanlines(),
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const executeCommand = (item: (typeof commands)[0]) => {
    item.action();
    setIsOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-sm font-mono"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[#0c111a] border border-[var(--accent)] shadow-[0_0_35px_rgba(0,255,102,0.25)] hud-chamfer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Prompt Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#101724] border-b border-[#1f2b3e]">
          <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
            <Terminal className="w-4 h-4" />
            <span>COMMAND_PALETTE // SUDO_SHELL</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close command palette"
            className="text-[#8b949e] hover:text-[#ff5555] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex items-center px-4 py-3 border-b border-[#1f2b3e] gap-3">
          <Search className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or query (e.g. 'amber', 'submit', 'ai')..."
            className="w-full bg-transparent text-sm text-[#e6edf3] placeholder-[#4b5563] outline-hidden font-mono"
          />
          <kbd className="text-[10px] bg-[#141d2d] border border-[#2b3c54] text-[#8b949e] px-1.5 py-0.5 select-none">
            ESC
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#182333] p-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#8b949e]">
              [ NO_COMMANDS_MATCHED: "{search}" ]
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[var(--accent-muted)] text-[var(--accent)] font-bold"
                      : "text-[#c9d1d9] hover:bg-[#141c29]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{cmd.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#6b7280]">
                    <span className="uppercase tracking-wider">{cmd.category}</span>
                    {isSelected && <ArrowRight className="w-3 h-3 text-[var(--accent)]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-[#080c14] border-t border-[#182333] flex items-center justify-between text-[10px] text-[#6b7280]">
          <div className="flex items-center gap-3">
            <span>[↑/↓] Navigate</span>
            <span>[↵] Select</span>
            <span>[Esc] Close</span>
          </div>
          <span className="text-[var(--accent)]">ACTIVE: {theme.toUpperCase()} CRT</span>
        </div>
      </div>
    </div>
  );
}
