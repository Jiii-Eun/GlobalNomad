"use client";

import Image from "next/image";

import { Status } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/cn";

interface ImagePreviewProps {
  src: string;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function ImagePreview({
  src,
  onDelete,
  onClick,
  disabled = false,
  className,
  onLoad,
}: ImagePreviewProps) {
  const baseClass = cn("size-[120px]", className);

  return (
    <div
      className={cn("relative inline-block", className)}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className={cn(
          baseClass,
          "relative overflow-hidden",
          disabled ? "cursor-default" : "cursor-pointer",
        )}
      >
        <Image
          src={src}
          alt="이미지 미리보기"
          fill
          unoptimized
          className="object-cover"
          onLoad={onLoad}
        />
      </div>

      {onDelete && (
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className={cn(
            "absolute -top-3 -right-3 z-10",
            "flex-center rounded-full bg-black/40 hover:bg-black/80",
          )}
        >
          <Status.CloseFill
            className={cn("h-10 w-10", "tablet:h-8 tablet:w-8", "mobile:h-6 mobile:w-6")}
          />
        </Button>
      )}
    </div>
  );
}
