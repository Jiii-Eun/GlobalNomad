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
  const src = profileImageUrl ? `${profileImageUrl}?v=${bust}` : "/profileImg.png";

  const isRemote = Boolean(profileImageUrl);

  return (
    <Image
      src={src}
      alt="프로필 이미지"
      width={size}
      height={size}
      unoptimized={isRemote}
      className={className}
    />
  );
}
