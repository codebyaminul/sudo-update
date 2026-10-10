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
    <div className="w-full">
      <div
        className={cn(
          "flex items-center w-full bg-[#0b1017] border px-3 py-2 text-sm font-mono transition-colors focus-within:border-[#00ff66] focus-within:shadow-[0_0_8px_rgba(0,255,102,0.2)]",
          error ? "border-[#ff5555]" : "border-[#1f2937]"
        )}
      >
        {promptPrefix && (
          <span className="text-[#00ff66]/70 mr-2 select-none font-bold">
            {promptPrefix}
          </span>
        )}
        <input
          className={cn(
            "w-full bg-transparent text-[#e5e7eb] placeholder-[#4b5563] outline-hidden font-mono text-sm",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs font-mono text-[#ff5555] flex items-center gap-1">
          <span>[!]</span> {error}
        </p>
      )}
    </div>
  );
}
