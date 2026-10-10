import React from "react";
import { Activity, Database, GitBranch } from "lucide-react";

export default function TerminalFooter() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#070a0f] text-[#6b7280] py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-1.5 text-[#00ff66]">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
            <span>NODE_STATUS: ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#59c2ff]" />
            <span>PG_POOL: ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#ffb454]" />
            <span>LATENCY: ~14MS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>BRANCH: MAIN // REV: 1.1.0</span>
          </div>
        </div>

        <div className="text-center md:text-right text-[#4b5563]">
          <span>sudo update // ENCRYPTED DISPATCH // GNU PUBLIC LICENSE</span>
        </div>
      </div>
    </footer>
  );
}
