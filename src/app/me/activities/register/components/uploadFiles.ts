import toFormData from "@/app/me/activities/register/components/toFormData";

export async function uploadFiles(
  files: (File | string)[],
  uploadImage: (formData: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<string[]> {
  const uploadedUrls = await Promise.all(
    files
      .filter((file): file is File => file instanceof File)
      .map((file) => uploadImage(toFormData(file)).then((r) => r.activityImageUrl)),
  );

  // string일 때 그대로
  const existingUrls = files.filter((v): v is string => typeof v === "string");

  return [...existingUrls, ...uploadedUrls];
}
