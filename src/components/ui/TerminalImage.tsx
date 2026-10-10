"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Terminal, ImageOff } from "lucide-react";

interface TerminalImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export default function TerminalImage({
  src,
  alt,
  className = "",
  aspectRatio = "video",
}: TerminalImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "wide"
      ? "aspect-21/9"
      : "aspect-video";

  if (!src || hasError) {
    return (
      <div
        className={`w-full ${aspectClass} bg-[#0e131b] border border-[#1f2937] flex flex-col items-center justify-center text-[#4b5563] p-4 select-none ${className}`}
      >
        {src ? (
          <ImageOff className="w-8 h-8 text-[#ef4444]/60 mb-2" />
        ) : (
          <Terminal className="w-8 h-8 text-[#00ff66]/40 mb-2" />
        )}
        <span className="text-[11px] font-mono tracking-widest uppercase text-center text-[#9ca3af]">
          {src ? "[ PACKET_PAYLOAD: IMG_LOAD_ERROR ]" : "[ NO_GRAPHIC_ATTACHED ]"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} bg-[#0e131b] border border-[#1f2937] overflow-hidden group ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e131b] z-10">
          <span className="text-[11px] font-mono text-[#00ff66]/70 animate-pulse">
            [ DECODING_BUFFER... ]
          </span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        className="object-cover transition-opacity duration-300 filter group-hover:brightness-105"
      />
      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 border border-[#1f2937] text-[9px] font-mono text-[#00ff66]/80 backdrop-blur-xs pointer-events-none">
        RAW_PAYLOAD
      </div>
    </div>
  );
}
