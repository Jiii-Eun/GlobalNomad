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
  originalUrls: string[],
  originalIds: number[],
  current: (File | string)[],
  uploadFn: (file: FormData) => Promise<{ activityImageUrl: string }>,
): Promise<{ subImageUrlsToAdd: string[]; subImageIdsToRemove: number[] }> {
  const subImageUrlsToAdd: string[] = [];
  const subImageIdsToRemove: number[] = [];

  const hasFile = current.some((x) => x instanceof File);

  for (const item of current) {
    if (typeof item === "string") {
      const existsInInitial = originalUrls.includes(item);
      if (!existsInInitial) {
        const existsInInitial = originalUrls.some((url) => url === item);
        if (!existsInInitial) subImageUrlsToAdd.push(item);
      }
    } else if (item instanceof File) {
      const formData = new FormData();
      formData.append("image", item);
      const { activityImageUrl } = await uploadFn(formData);
      subImageUrlsToAdd.push(activityImageUrl);
    }
  }

  originalUrls.forEach((url, index) => {
    const stillExists = current.some((item) => typeof item === "string" && item === url);
    if (!stillExists) {
      const id = originalIds[index];
      if (id !== undefined) subImageIdsToRemove.push(id);
    }
  });

  if (!hasFile) {
    return { subImageUrlsToAdd: [], subImageIdsToRemove };
  }

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
