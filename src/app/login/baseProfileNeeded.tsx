import { editMe } from "@/lib/api/users/api";
import { UserRes } from "@/lib/api/users/types";
import { apiRequest } from "@/lib/apiRequest";

const DEFAULT_IMG_PATH = "/profileImg.png";

function pickUploadUrl(res: unknown): string | null {
  if (typeof res !== "object" || res === null) return null;
  const o = res as Record<string, unknown>;

  const fromData = (obj: unknown, key: "profileImageUrl" | "url") =>
    typeof obj === "object" && obj !== null ? (obj as Record<string, unknown>)[key] : undefined;

  const cands: unknown[] = [
    o.profileImageUrl,
    o.imageUrl,
    o.url,
    fromData(o.data, "profileImageUrl"),
    fromData(o.data, "url"),
  ];

  for (const v of cands) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

export async function baseProfileNeeded(me: UserRes) {
  try {
    if (me?.profileImageUrl) return;

    const seededKey = `profileSeeded:${me.id}`;
    if (typeof window !== "undefined" && localStorage.getItem(seededKey)) return;

    const resp = await fetch(DEFAULT_IMG_PATH, { cache: "no-store" });
    if (!resp.ok) throw new Error(`기본 이미지 로드 실패: ${resp.status}`);
    const blob = await resp.blob();

    const fd = new FormData();
    fd.append("image", blob, "default.png");

    const uploadRes = await apiRequest<unknown>("/users/me/image", {
      method: "POST",
      isFormData: true,
      data: fd,
      credentials: "include",
    });

    const url = pickUploadUrl(uploadRes);
    if (!url) throw new Error("URL 추출 실패: 업로드 응답에 URL이 없습니다.");

    await editMe({ profileImageUrl: url });

    if (typeof window !== "undefined") {
      localStorage.setItem(seededKey, "true");
    }
  } catch (e) {
    console.warn("baseProfileNeeded 실패:", e);
  }
}
