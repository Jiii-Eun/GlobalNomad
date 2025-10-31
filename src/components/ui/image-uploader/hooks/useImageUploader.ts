"use client";

import { useState, useEffect } from "react";

import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";

interface UseImageUploaderOptions {
  limit?: number;
  initialImages?: (File | string)[];
  onChange?: (images: (File | string)[]) => void;
}

export function useImageUploader({
  limit = 1,
  initialImages = [],
  onChange,
}: UseImageUploaderOptions) {
  const [images, setImages] = useState<(File | string)[]>(initialImages);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const {
    inputRef,
    openFileDialog,
    handleFileChange: baseHandleFileChange,
  } = useFileInput({
    onFileSelect: (file) => {
      setImages((prev) => {
        let next: (File | string)[];
        if (replaceIndex !== null) {
          next = [...prev];
          next[replaceIndex] = file;
        } else {
          next = [...prev, file].slice(0, limit);
        }

        onChange?.(next);
        return next;
      });

      setReplaceIndex(null);
    },
  });

  useEffect(() => {
    if (initialImages.length && JSON.stringify(initialImages) !== JSON.stringify(images)) {
      setImages(initialImages);
    }
  }, [JSON.stringify(initialImages)]);

  const handleOpenDialog = (index?: number) => {
    if (typeof index === "number") setReplaceIndex(index);
    openFileDialog();
  };

  const handleDelete = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onChange?.(next);
      return next;
    });
  };

  const canAddMore = images.length < limit;

  return {
    images,
    inputRef,
    canAddMore,
    openFileDialog: handleOpenDialog,
    handleFileChange: baseHandleFileChange,
    handleDelete,
  };
}
