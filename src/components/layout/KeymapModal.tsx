"use client";

import React, { useState, useEffect } from "react";
import { Terminal, X, Keyboard } from "lucide-react";

export default function KeymapModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const keybindings = [
    { key: "j / ↓", desc: "Focus next dispatch packet in feed" },
    { key: "k / ↑", desc: "Focus previous dispatch packet in feed" },
    { key: "Enter", desc: "Inspect focused dispatch debrief & notes" },
    { key: "b", desc: "Signal boost currently focused dispatch" },
    { key: "o", desc: "Open raw source in new browser tab" },
    { key: "/", desc: "Jump to terminal grep search bar" },
    { key: "c", desc: "Navigate to transmit intel portal (/submit)" },
    { key: "Ctrl + K", desc: "Open system HUD command palette" },
    { key: "?", desc: "Toggle this terminal keybindings cheat sheet" },
    { key: "Esc", desc: "Close open modal or cancel active focus" },
  ];

  return (
    <>
      {/* Floating Shortcut Trigger Pill */}
      <div className="fixed bottom-4 right-4 z-30 select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-[#1f2d42] bg-[#0c121d]/90 hover:border-[var(--accent)] hover:text-[var(--accent)] text-[#8b949e] backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Terminal Keybindings Cheat Sheet (?)"
        >
          <Keyboard className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>[ ? KEYMAP ]</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono select-none"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0b1018] border border-[var(--accent)] shadow-[0_0_35px_rgba(0,255,102,0.2)] hud-chamfer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0f1622] border-b border-[#1c2738]">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
                <Terminal className="w-4 h-4" />
                <span>TERMINAL_KEYMAP // CHEAT_SHEET</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8b949e] hover:text-[#ff5555] transition-colors p-1"
                aria-label="Close keymap cheat sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Table */}
            <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
              <div className="text-[11px] text-[#6b7280] pb-2 border-b border-[#16202e]">
                Operators can navigate the intelligence feed entirely via keyboard:
              </div>

              <div className="divide-y divide-[#141b27]">
                {keybindings.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2 text-xs"
                  >
                    <span className="text-[#9ca3af]">{item.desc}</span>
                    <kbd className="px-2 py-0.5 bg-[#121a26] border border-[#233145] text-[var(--accent)] text-[11px] font-bold rounded-none shrink-0 ml-3">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-[#080d14] border-t border-[#16202e] flex items-center justify-between text-[10px] text-[#6b7280]">
              <span>HINT: PRESS '?' ANYTIME TO TOGGLE</span>
              <span className="text-[var(--accent)]">[ESC TO DISMISS]</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
