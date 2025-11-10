"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Btn } from "@/components/icons";
import Button from "@/components/ui/button/Button";
import { useFileInput } from "@/components/ui/image-uploader/hooks/useFileInput";
import ImagePreview from "@/components/ui/image-uploader/ImagePreview";
import { useUploadProfileImage, useEditMe } from "@/lib/api/users/hooks";
import { UserRes } from "@/lib/api/users/types";
import { cn } from "@/lib/cn";

const DEFAULT_PROFILE = "/profileImg.png";

export default function ProfileImageUploader({ initialUrl }: { initialUrl?: string | null }) {
  const qc = useQueryClient();
  const uploadMutation = useUploadProfileImage(false);
  const editMutation = useEditMe(false);
  const [toRevoke, setToRevoke] = useState<string | null>(null);
  const normalizeUrl = (u?: string | null) =>
    typeof u === "string" && u.trim() !== "" ? u.trim() : DEFAULT_PROFILE;
  const [preview, setPreview] = useState(() => normalizeUrl(initialUrl));

  useEffect(() => {
    const safe = normalizeUrl(initialUrl);
    if (safe !== preview) setPreview(safe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const { inputRef, openFileDialog, handleFileChange } = useFileInput({
    onFileSelect: async (file) => {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setToRevoke(localUrl);

      try {
        const fd = new FormData();
        fd.append("image", file, file.name || "profile.png");
        const res = await uploadMutation.mutateAsync(fd);
        const url =
          typeof res?.profileImageUrl === "string" && res.profileImageUrl.trim() !== ""
            ? res.profileImageUrl.trim()
            : undefined;
        if (!url) throw new Error("업로드 응답에 url이 없습니다.");

        await editMutation.mutateAsync({ profileImageUrl: url });

        const bust = url.includes("?") ? `${url}&v=${Date.now()}` : `${url}?v=${Date.now()}`;
        setPreview(bust);

        qc.setQueryData(["me"], (prev: UserRes) =>
          prev ? { ...prev, profileImageUrl: url } : prev,
        );
        void qc.invalidateQueries({ queryKey: ["me"] });
      } catch {
        setPreview(initialUrl || DEFAULT_PROFILE);
      } finally {
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.blur?.();
        }
      }
    },
  });

  const handleDelete = async () => {
    const prev = preview;
    setPreview(DEFAULT_PROFILE);

    try {
      await editMutation.mutateAsync({ profileImageUrl: null });
      qc.setQueryData(["me"], (p: UserRes) => (p ? { ...p, profileImageUrl: null } : p));
      void qc.invalidateQueries({ queryKey: ["me"] });
    } catch {
      setPreview(prev);
    }
  };

  const isDefault = preview === DEFAULT_PROFILE;
  const baseClass = "size-[160px] rounded-full";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(baseClass, "shadow-base relative")}>
        <ImagePreview
          key={preview}
          src={preview}
          onDelete={!isDefault ? handleDelete : undefined}
          disabled={true}
          className={baseClass}
          onLoad={() => {
            if (toRevoke && toRevoke.startsWith("blob:")) {
              URL.revokeObjectURL(toRevoke);
              setToRevoke(null);
            }
          }}
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
