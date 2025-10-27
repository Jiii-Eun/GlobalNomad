export async function diffMainImages(
  originalUrl: string | undefined,
  current: (File | string)[],
  uploadImage: (f: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<string | undefined> {
  if (!current.length) return undefined;
  const curr = current[0];
  const currentUrl = typeof curr === "string" ? curr : await uploadOne(curr, uploadImage);
  return currentUrl === originalUrl ? undefined : currentUrl;
}

export async function diffSubImages(
  initialUrls: string[],
  initialIds: number[],
  current: (File | string)[],
  uploadFn: (file: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<{ subImageUrlsToAdd: string[]; subImageIdsToRemove: number[] }> {
  const subImageUrlsToAdd: string[] = [];
  const subImageIdsToRemove: number[] = [];

  for (const item of current) {
    if (typeof item === "string") {
      const existsInInitial = initialUrls.includes(item);
      if (!existsInInitial) {
        subImageUrlsToAdd.push(item);
      }
    } else if (item instanceof File) {
      const formData = new FormData();
      formData.append("image", item);
      const { activityImageUrl } = await uploadFn(formData);
      subImageUrlsToAdd.push(activityImageUrl);
    }
  }

  initialUrls.forEach((url, idx) => {
    const stillExists = current.some((item) => typeof item === "string" && item === url);
    if (!stillExists) {
      const id = initialIds[idx];
      if (id !== undefined) subImageIdsToRemove.push(id);
    }
  });

  return { subImageUrlsToAdd, subImageIdsToRemove };
}

async function uploadOne(
  file: File,
  uploadImage: (f: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await uploadImage(fd);
  return res.activityImageUrl;
}
