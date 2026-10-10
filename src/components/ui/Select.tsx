import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  promptPrefix?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({
  promptPrefix = "cat:",
  error,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full font-mono">
      <div
        className={cn(
          "flex items-center w-full bg-[#0b1017] border px-3 py-2 text-sm min-h-[44px] transition-colors focus-within:border-[var(--accent)] focus-within:shadow-[0_0_12px_rgba(0,255,102,0.2)]",
          error ? "border-[#ff5555]" : "border-[#1e2638]"
        )}
      >
        {promptPrefix && (
          <span className="text-[var(--accent)] mr-2 select-none font-bold text-xs uppercase">
            {promptPrefix}
          </span>
        )}
        <select
          className={cn(
            "w-full bg-[#0b1017] text-[var(--accent)] outline-hidden font-mono text-sm cursor-pointer",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0b1017] text-[var(--accent)]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#ff5555] flex items-center gap-1 font-bold">
          <span>[!]</span> {error}
        </p>
      )}
    </div>
  );
}
