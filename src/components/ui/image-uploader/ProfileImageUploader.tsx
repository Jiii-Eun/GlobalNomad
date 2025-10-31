"use client";

import { useState } from "react";

import { Btn } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";
import ImagePreview from "@/components/ui/image-uploader/ImagePreview";
import { useUploadProfileImage, useEditMe } from "@/lib/api/users/hooks";
import { cn } from "@/lib/cn";

const DEFAULT_PROFILE = "/mock/default-profile.png";

export default function ProfileImageUploader({ initialUrl }: { initialUrl?: string | null }) {
  const [preview, setPreview] = useState(initialUrl || DEFAULT_PROFILE);
  const uploadMutation = useUploadProfileImage(true);
  const editMutation = useEditMe(true);

  const { inputRef, openFileDialog, handleFileChange } = useFileInput({
    onFileSelect: async (file) => {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      const formData = new FormData();
      formData.append("image", file);

      const { profileImageUrl } = await uploadMutation.mutateAsync(formData);
      await editMutation.mutateAsync({ profileImageUrl });
    },
  });

  const handleDelete = async () => {
    setPreview(DEFAULT_PROFILE);
    await editMutation.mutateAsync({ profileImageUrl: null });
  };

  const isDefault = preview.includes(DEFAULT_PROFILE);
  const baseClass = "size-[160px] rounded-full";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(baseClass, "relative shadow-[0_4px_16px_rgba(0,0,0,0.08)]")}>
        <ImagePreview
          src={preview}
          onDelete={!isDefault ? handleDelete : undefined}
          disabled={true}
          className={baseClass}
        />
        <Button
          type="button"
          onClick={openFileDialog}
          className={cn(
            "absolute right-1.5 bottom-1.5",
            "bg-brand-deep-green-500 hover:bg-brand-deep-green-50 h-11 w-11 rounded-full duration-20",
          )}
        >
          <Btn.Edit className="svg-fill hover:text-brand-deep-green-50 text-brand-deep-green-500 h-full w-full" />
        </Button>
      </div>

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
