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
    "font-mono uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 border disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs min-h-[36px]",
    md: "px-4 py-2 text-sm min-h-[44px]",
    lg: "px-6 py-2.5 text-base min-h-[48px]",
  };

  const variantStyles = {
    primary:
      "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)] hover:brightness-125 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] active:scale-[0.98]",
    secondary:
      "bg-[#131924] text-[#e6edf3] border-[#2c3a50] hover:border-[#8b949e] hover:bg-[#1a2332] active:scale-[0.98]",
    danger:
      "bg-[#ff5555]/15 text-[#ff5555] border-[#ff5555] hover:bg-[#ff5555]/25 hover:shadow-[0_0_15px_rgba(255,85,85,0.3)] active:scale-[0.98]",
    warning:
      "bg-[#ffb454]/15 text-[#ffb454] border-[#ffb454] hover:bg-[#ffb454]/25 hover:shadow-[0_0_15px_rgba(255,180,84,0.3)] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#8b949e] border-transparent hover:text-[var(--accent)] hover:border-[#1e2638] active:scale-[0.98]",
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
