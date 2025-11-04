"use client";

import { useRef, useState } from "react";

import { Misc, Status } from "@/components/icons";
import NotificationDropDown from "@/components/ui/header/NotificationDropDown";
import { getMyNotifications } from "@/lib/api/my-notifications/api";
import { GetNotifsReq, GetNotifsRes } from "@/lib/api/my-notifications/types";
import { useInfiniteScrollQuery } from "@/lib/hooks/useInfiniteScroll";
import useOutsideClick from "@/lib/hooks/useOutsideClick";

export default function Notification() {
  const [isNotification, setIsNotification] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onToggleNotification = () => setIsNotification((prev) => !prev);
  const handleCloseNotification = () => setIsNotification(false);

  useOutsideClick(containerRef, () => {
    if (isNotification) handleCloseNotification();
  });

  const { data, targetRef } = useInfiniteScrollQuery<GetNotifsRes, GetNotifsReq>({
    queryKey: ["myNotifications"],
    fetchFn: getMyNotifications,
    initialParams: { size: 5 },
    rootRef: scrollRef,
  });

  const totalCount = data[0]?.totalCount ?? 0;

  return (
    <div ref={containerRef} className="relative">
      <button onClick={onToggleNotification}>
        <Misc.NotificationBell className="size-5" />
        {totalCount && (
          <Status.DotSmallRed className="absolute -top-0.5 right-0 size-2 rounded-full border-1 border-white" />
        )}
      </button>

      <NotificationDropDown
        isOpen={isNotification}
        onClose={handleCloseNotification}
        data={data}
        targetRef={targetRef}
        scrollRef={scrollRef}
        totalCount={totalCount}
      />
    </div>
  );
}
