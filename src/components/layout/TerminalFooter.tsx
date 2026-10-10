import React from "react";
import { Activity, Database, GitBranch, Cpu, ShieldCheck } from "lucide-react";

export default function TerminalFooter() {
  return (
    <footer className="border-t border-[#1f2638] bg-[#070a0f] text-[#6b7280] py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-1.5 text-[var(--accent)] font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>NODE_STATUS: ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>SUPABASE_POOLER: CONNECTED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#ffb454]" />
            <span>LATENCY: ~14MS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#8b949e]" />
            <span>BRANCH: MAIN // REV: 1.2.0</span>
          </div>
        </div>

        <div className="text-center md:text-right text-[#4b5563] flex items-center gap-2 justify-center md:justify-end">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>sudo update // ENCRYPTED DISPATCH // GNU GPLv3</span>
        </div>
      </div>
    </footer>
  );
}
