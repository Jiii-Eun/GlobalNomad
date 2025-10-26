"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MyActivityForm from "@/app/me/activities/register/components/MyActivityForm";
import Toast from "@/components/ui/toast";
import { useActivityDetail } from "@/lib/api/activities/hooks";
import { useUpdateMyActivity } from "@/lib/api/my-activities/hooks";
import type { UpdateActivityReq, UpdateActivityRes } from "@/lib/api/my-activities/types";

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const activityId = Number(id);

  const { mutateAsync: updateActivity } = useUpdateMyActivity(false);
  const [defaultValues, setDefaultValues] = useState<UpdateActivityReq | null>(null);

  const { data: detail, isLoading } = useActivityDetail(activityId, false, {
    onError: (error) => {
      console.error(error);
      <Toast message="체험 정보를 불러오지 못했습니다." />;
    },
  });

  useEffect(() => {
    if (!detail) return;

    const { title, description, price, address, category, bannerImageUrl, subImages, schedules } =
      detail;

    setDefaultValues({
      activityId,
      title,
      description,
      price,
      address,
      category,
      bannerImageUrl,
      subImageUrlsToAdd: subImages?.map((s) => s.imageUrl) ?? [],
      subImageIdsToRemove: [],
      schedulesToAdd: schedules ?? [],
      scheduleIdsToRemove: [],
    });
  }, [detail, activityId]);

  if (isLoading) return <div>불러오는 중...</div>;

  if (!detail || !defaultValues) return <div>데이터를 불러올 수 없습니다.</div>;

  return (
    <MyActivityForm<UpdateActivityReq, UpdateActivityRes>
      defaultValues={defaultValues}
      isEdit
      apiActivity={updateActivity}
      onAfterSubmit={() => router.push("/me/activities")}
    />
  );
}
