"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

interface BackgroundImageProps {
  src?: string;
  alt?: string;
  overlay?: string;
  onLoaded?: () => void;
  imageClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BackgroundImage({
  src,
  alt = "",
  overlay,
  onLoaded,
  imageClass,
  className,
  children,
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isLoaded ? "opacity-0" : "shimmer opacity-100",
        )}
      />
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          decoding="async"
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            imageClass,
          )}
          onLoad={() => {
            setIsLoaded(true);
            onLoaded?.();
          }}
        />
      ) : (
        <>{children}</>
      )}

      {overlay && (
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ background: overlay }}
        />
      )}
    </div>
  );
}
