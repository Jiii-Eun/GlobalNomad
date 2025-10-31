"use client";

import { ProfileImageUploader, ActivityImageUploader } from "@/components/ui/image-uploader";
import { useGetMe } from "@/lib/api/users/hooks";

export default function TestImageUploaderPage() {
  const { data: user, isLoading } = useGetMe(true);

  if (isLoading) return <p>로딩 중...</p>;
  if (!user) return <p>유저 정보를 불러오지 못했습니다.</p>;
  return (
    <div className="flex min-h-screen flex-col items-center gap-12 bg-gray-50 py-10">
      {/* ✅ Profile */}
      <div className="flex flex-col items-center gap-6 py-10">
        <h2 className="text-xl font-semibold text-gray-800">{user.nickname}님의 프로필 이미지</h2>

        {/* ✅ ProfileImageUploader에 mock user의 이미지 URL 전달 */}
        <ProfileImageUploader initialUrl={user.profileImageUrl} />
      </div>

      {/* ✅ Activity */}
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">🏞️ ActivityImageUploader</h2>
        <ActivityImageUploader type="sub" />
      </section>
    </div>
  );
}
