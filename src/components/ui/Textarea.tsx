import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  promptPrefix?: string;
  error?: string;
}

export default function Textarea({
  promptPrefix = "cat << EOF",
  error,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full bg-[#0b1017] border p-3 font-mono text-sm transition-colors focus-within:border-[#00ff66] focus-within:shadow-[0_0_8px_rgba(0,255,102,0.2)]",
          error ? "border-[#ff5555]" : "border-[#1f2937]"
        )}
      >
        {promptPrefix && (
          <div className="text-[#8b949e] text-xs mb-2 select-none font-bold">
            {promptPrefix}
          </div>
        )}
        <textarea
          className={cn(
            "w-full bg-transparent text-[#e5e7eb] placeholder-[#4b5563] outline-hidden font-mono text-sm resize-y min-h-[120px]",
            className
          )}
          {...props}
        />
        <div className="text-[#8b949e] text-xs mt-1 select-none text-right font-bold">
          EOF
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs font-mono text-[#ff5555] flex items-center gap-1">
          <span>[!]</span> {error}
        </p>
      )}
    </div>
  );
}
