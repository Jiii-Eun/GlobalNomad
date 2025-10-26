import { ChangeEvent, useRef } from "react";

interface UseFileInputOptions {
  onFileSelect?: (file: File) => void;
  onError?: (message: string | null) => void;
}

const MAX_SIZE_MB = 4.5;

export function useFileInput({ onFileSelect, onError }: UseFileInputOptions = {}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => inputRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      onError?.(`파일 크기는 ${MAX_SIZE_MB}MB 이하만 업로드 가능합니다.`);
      e.target.value = "";
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      onError?.("JPG, PNG, WEBP 형식의 이미지만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }
    onError?.(null);

    onFileSelect?.(file);
    e.target.value = "";
  };

  return {
    inputRef,
    openFileDialog,
    handleFileChange,
  };
}
