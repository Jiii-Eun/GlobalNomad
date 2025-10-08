"use client";

import { ChangeEvent, useRef } from "react";

interface UseFileInputOptions {
  onFileSelect?: (file: File) => void;
}

export function useFileInput({ onFileSelect }: UseFileInputOptions = {}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => inputRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect?.(file);
    e.target.value = "";
  };

  return {
    inputRef,
    openFileDialog,
    handleFileChange,
  };
}
