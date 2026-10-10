import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  isLoading,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-mono uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
  };

  const variantStyles = {
    primary:
      "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/60 hover:bg-[#00ff66]/20 hover:border-[#00ff66] hover:shadow-[0_0_12px_rgba(0,255,102,0.3)] active:scale-[0.98]",
    secondary:
      "bg-[#141a23] text-[#e5e7eb] border-[#374151] hover:border-[#9ca3af] hover:bg-[#1a2330] active:scale-[0.98]",
    danger:
      "bg-[#ff5555]/10 text-[#ff5555] border-[#ff5555]/50 hover:bg-[#ff5555]/20 hover:border-[#ff5555] hover:shadow-[0_0_12px_rgba(255,85,85,0.3)] active:scale-[0.98]",
    warning:
      "bg-[#ffb454]/10 text-[#ffb454] border-[#ffb454]/50 hover:bg-[#ffb454]/20 hover:border-[#ffb454] hover:shadow-[0_0_12px_rgba(255,180,84,0.3)] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#9ca3af] border-transparent hover:text-[#00ff66] hover:border-[#1f2937] active:scale-[0.98]",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 bg-current rounded-full animate-ping" />
          <span>[ PROCESSING... ]</span>
        </span>
      ) : (
        <>
          <span className="opacity-70">[</span>
          {children}
          <span className="opacity-70">]</span>
        </>
      )}
    </button>
  );
}
