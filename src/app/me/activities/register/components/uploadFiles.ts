"use client";

import toFormData from "@/app/me/activities/register/components/toFormData";

export async function uploadFiles(
  files: (File | string)[],
  uploadImage: (formData: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<string[]> {
  const uploadedUrls = await Promise.all(
    files
      .filter((file): file is File => file instanceof File)
      .map(async (file) => {
        const MAX_SIZE_MB = 4.5;
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_SIZE_MB) {
          throw new Error(`파일 크기는 ${MAX_SIZE_MB}MB 이하만 업로드 가능합니다.`);
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("이미지 파일만 업로드할 수 있습니다.");
        }

        const result = await uploadImage(toFormData(file));
        return result.activityImageUrl;
      }),
  );

  const existingUrls = files.filter((v): v is string => typeof v === "string");

  return [...existingUrls, ...uploadedUrls];
}
