"use client";

import { useEffect, useRef } from "react";

import { Btn } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { useImageUploader } from "@/components/ui/image-uploader/hooks/useImageUploader";
import ImagePreview from "@/components/ui/image-uploader/ImagePreview";
import { cn } from "@/lib/cn";

interface ActivityImageUploaderProps {
  type?: "banner" | "sub";
  limit?: number;
  initialImages?: string[];
  onChange?: (images: (File | string)[]) => void;
  onError?: (msg: string | null) => void;
  frameClass?: string;
}

export default function ActivityImageUploader({
  type = "banner",
  limit: customLimit,
  initialImages = [],
  onChange,
  onError,
  frameClass,
}: ActivityImageUploaderProps) {
  const defaultLimit = type === "banner" ? 1 : 4;
  const limit = customLimit ?? defaultLimit;

  const { images, error, inputRef, canAddMore, openFileDialog, handleFileChange, handleDelete } =
    useImageUploader({ limit, initialImages });

  useEffect(() => {
    if (mountedRef.current) {
      if (onChange) onChange(images);
    } else {
      mountedRef.current = true;
    }
  }, [images]);

  useEffect(() => {
    if (onError) onError(error);
  }, [error]);

  const mountedRef = useRef(false);

  const listClass =
    "aspect-square flex-[1_0_180px] max-w-[180px] h-full w-full hover:scale-98 transition-all duration-150";

  return (
    <div
      className={cn(
        "flex-wrap content-start items-start justify-start",
        "flex w-full gap-6",
        "tablet:gap-4 mobile:gap-2",
        frameClass,
      )}
    >
      {canAddMore && (
        <Button
          type="button"
          onClick={() => openFileDialog()}
          className={cn(
            listClass,
            "rounded-12 flex flex-col items-center justify-center gap-7 border-dashed bg-white hover:bg-white",
          )}
        >
          <Btn.AddImage className="size-45" />
        </Button>
      )}

      {images.map((item, index) => {
        const src = typeof item === "string" ? item : URL.createObjectURL(item);
        return (
          <ImagePreview
            key={index}
            src={src}
            onClick={() => openFileDialog(index)}
            onDelete={() => handleDelete(index)}
            className={cn(listClass, "rounded-24 object-cover")}
            onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
          />
        );
      })}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
