"use client";

import toFormData from "@/app/(header)/me/activities/register/components/toFormData";

export async function uploadFiles(
  files: (File | string)[],
  uploadImage: (formData: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<string[]> {
  if (!files.length) return [];

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (typeof file === "string") {
      uploadedUrls.push(file);
      continue;
    }

    try {
      const formData = toFormData(file);
      const { activityImageUrl } = await uploadImage(formData);
      uploadedUrls.push(activityImageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  }

  return uploadedUrls;
}
