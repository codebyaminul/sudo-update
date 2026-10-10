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
    <div className="w-full">
      <div
        className={cn(
          "flex items-center w-full bg-[#0b1017] border px-3 py-2 text-sm font-mono transition-colors focus-within:border-[#00ff66] focus-within:shadow-[0_0_8px_rgba(0,255,102,0.2)]",
          error ? "border-[#ff5555]" : "border-[#1f2937]"
        )}
      >
        {promptPrefix && (
          <span className="text-[#59c2ff]/80 mr-2 select-none font-bold text-xs uppercase">
            {promptPrefix}
          </span>
        )}
        <select
          className={cn(
            "w-full bg-[#0b1017] text-[#00ff66] outline-hidden font-mono text-sm cursor-pointer",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0b1017] text-[#00ff66]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs font-mono text-[#ff5555] flex items-center gap-1">
          <span>[!]</span> {error}
        </p>
      )}
    </div>
  );
}
