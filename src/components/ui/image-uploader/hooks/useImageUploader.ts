import { useState, useEffect } from "react";

import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";

interface UseImageUploaderOptions {
  limit?: number;
  initialImages?: (File | string)[];
  onChange?: (images: (File | string)[]) => void;
  onError?: (msg: string | null) => void;
}

export function useImageUploader({
  limit = 1,
  initialImages = [],
  onChange,
  onError,
}: UseImageUploaderOptions) {
  const [images, setImages] = useState<(File | string)[]>(initialImages);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    inputRef,
    openFileDialog,
    handleFileChange: baseHandleFileChange,
  } = useFileInput({
    onFileSelect: (file) => {
      setError(null);

      setImages((prev) => {
        let next: (File | string)[];
        if (replaceIndex !== null) {
          next = [...prev];
          next[replaceIndex] = file;
        } else {
          next = [...prev, file].slice(0, limit);
        }
        return next;
      });

      setReplaceIndex(null);
    },
    onError: (msg) => {
      setError(msg);
      onError?.(msg);
    },
  });

  useEffect(() => {
    if (
      initialImages.length > 0 &&
      images.length > 0 &&
      JSON.stringify(initialImages) !== JSON.stringify(images)
    ) {
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
      return next;
    });
  };

  useEffect(() => {
    if (onChange) onChange(images);
  }, [images, onChange]);

  const canAddMore = images.length < limit;

  return {
    images,
    error,
    inputRef,
    canAddMore,
    openFileDialog: handleOpenDialog,
    handleFileChange: baseHandleFileChange,
    handleDelete,
  };
}
