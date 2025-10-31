"use client";

import { editMe, getMe, uploadProfileImage } from "@/lib/api/users/api";

const DEFAULT_PROFILE_URL = "/profileImg.png";

let seedingInProgress = false;

export async function baseProfileSetting() {
  if (seedingInProgress) return;

  const me = await getMe().catch(() => null);
  if (!me?.id) return;

  if (me.profileImageUrl && me.profileImageUrl.trim() !== "") return;
  seedingInProgress = true;

  try {
    const res = await fetch(DEFAULT_PROFILE_URL).catch(() => null);
    if (!res || !res.ok) return;

    const blob = await res.blob();
    const fd = new FormData();
    fd.append("image", blob, "profileImg.png");

    const upload = await uploadProfileImage(fd).catch(() => null);
    const url =
      typeof upload?.profileImageUrl === "string"
        ? upload.profileImageUrl.trim() || undefined
        : undefined;

    if (url) {
      await editMe({ profileImageUrl: url, nickname: me.nickname });
    }
  } finally {
    seedingInProgress = false;
  }
}
