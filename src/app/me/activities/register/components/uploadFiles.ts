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
        const result = await uploadImage(toFormData(file));
        return result.activityImageUrl;
      }),
  );

  const existingUrls = files.filter((v): v is string => typeof v === "string");
  return [...existingUrls, ...uploadedUrls];
}
