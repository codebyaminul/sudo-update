import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  promptPrefix?: string;
  error?: string;
}

export default function Input({
  promptPrefix = "$",
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full font-mono">
      <div
        className={cn(
          "flex items-center w-full bg-[#0b1017] border px-3 py-2.5 text-sm min-h-[44px] transition-colors focus-within:border-[var(--accent)] focus-within:shadow-[0_0_12px_rgba(0,255,102,0.2)]",
          error ? "border-[#ff5555]" : "border-[#1e2638]"
        )}
      >
        {promptPrefix && (
          <span className="text-[var(--accent)] mr-2 select-none font-bold text-xs">
            {promptPrefix}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-transparent text-[#e6edf3] placeholder-[#4b5563] outline-hidden font-mono text-sm",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#ff5555] flex items-center gap-1 font-bold">
          <span>[!]</span> {error}
        </p>
      )}
    </div>
  );
}
