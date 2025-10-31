"use client";

import { useState } from "react";

import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";

interface useProfileImageUploaderOptions {
  initialUrl?: string | null;
  defaultImage?: string;
  onUpload?: (file: File) => Promise<string>;
  onDelete?: () => Promise<void>;
}

export function useProfileImageUploader({
  initialUrl,
  defaultImage,
  onUpload,
  onDelete,
}: useProfileImageUploaderOptions) {
  const [preview, setPreview] = useState(initialUrl || defaultImage || "");
  const [isDefault, setIsDefault] = useState(!initialUrl);

  const { inputRef, openFileDialog, handleFileChange } = useFileInput({
    onFileSelect: async (file) => {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      if (onUpload) {
        const uploadedUrl = await onUpload(file);
        setPreview(uploadedUrl);
        setIsDefault(false);
      }
    },
  });

  const handleDelete = async () => {
    if (onDelete) await onDelete();
    setPreview(defaultImage || "");
    setIsDefault(true);
  };

  return {
    preview,
    isDefault,
    inputRef,
    openFileDialog,
    handleFileChange,
    handleDelete,
  };
}
