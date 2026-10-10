"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Terminal } from "lucide-react";

export default function TerminalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if URL param changes externally
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Global '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/?${params.toString()}`);
    inputRef.current?.blur();
  };

  return (
    <div className="w-full font-mono">
      <div className="flex items-center w-full bg-[#0b1017] border border-[#1f2937] px-3 py-2 transition-all focus-within:border-[#00ff66] focus-within:shadow-[0_0_12px_rgba(0,255,102,0.2)]">
        <div className="flex items-center gap-1.5 text-[#00ff66]/80 text-xs mr-2 select-none shrink-0 font-bold">
          <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="hidden sm:inline">grep -i</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Query dispatches by keyword, technology, or host... (Press "/" to focus)'
          className="w-full bg-transparent text-sm text-[#e5e7eb] placeholder-[#4b5563] outline-hidden font-mono"
        />

        <div className="flex items-center gap-2 shrink-0">
          {query ? (
            <button
              onClick={handleClear}
              className="text-[#8b949e] hover:text-[#ff5555] p-1 transition-colors cursor-pointer"
              title="Clear search query (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-[#4b5563] border border-[#1f2937] bg-[#111620] select-none">
              /
            </kbd>
          )}

          <button
            onClick={() => handleSearch(query)}
            className="px-2 py-0.5 text-xs text-[#00ff66] border border-[#00ff66]/40 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 transition-all select-none cursor-pointer"
            title="Execute search"
          >
            [EXEC]
          </button>
        </div>
      </div>
    </div>
  );
}
