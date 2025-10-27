"use client";

import Image from "next/image";

interface AvatarProps {
  profileImageUrl?: string | null;
  size?: number;
  updatedAt?: string;
  className?: string;
}

export default function Avatar({ profileImageUrl, size = 40, updatedAt, className }: AvatarProps) {
  const bust = updatedAt ? new Date(updatedAt).getTime() : Date.now();

  // 원격이면 프록시로 감싸 동일 출처 URL로 만들기
  const raw = profileImageUrl ? `${profileImageUrl}?v=${bust}` : "/profileImg.png";
  const src = profileImageUrl ? `/api/image?src=${encodeURIComponent(raw)}` : raw;

  return <Image src={src} alt="프로필 이미지" width={size} height={size} className={className} />;
}
