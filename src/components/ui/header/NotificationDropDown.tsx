"use client";

import { createPortal } from "react-dom";

import { Status } from "@/components/icons";
import { useDeleteMyNotification } from "@/lib/api/my-notifications/hooks";
import type { GetNotifsRes, Notification } from "@/lib/api/my-notifications/types";
import { cn } from "@/lib/cn";
import { useDevice } from "@/lib/hooks/useDevice";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { usePortal } from "@/lib/hooks/usePortal";
import { flattenPages } from "@/lib/utills/flattenPages";
import getTimeAgo from "@/lib/utills/getTimeAgo";

interface NotificationDropDownProps {
  isOpen: boolean;
  onClose: () => void;
  data: GetNotifsRes[];
  targetRef: (node?: HTMLDivElement | null) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  totalCount: number;
}

export default function NotificationDropDown({
  isOpen,
  onClose,
  data,
  targetRef,
  scrollRef,
  totalCount,
}: NotificationDropDownProps) {
  const { isMobile } = useDevice();
  const portalRoot = usePortal("notification-portal");

  useLockBodyScroll(isOpen && isMobile);

  const { mutate: deleteNotification } = useDeleteMyNotification();

  const notifications = flattenPages(data, (page) => page.notifications);

  const handleDelete = (id: number) => {
    deleteNotification({ notificationId: id });
  };

  const bgClass = cn(
    "bg-brand-deep-green-50 absolute top-14 -right-32 z-600 h-[356px] min-w-[356px]",
    "flex flex-col shadow-blue rounded-[10px] px-5 py-6",
    "tablet:-right-4",
    "mobile:min-w-full mobile:min-h-screen mobile:top-0 mobile:right-0 mobile:rounded-none mobile:border-0 mobile:py-10 mobile:fixed mobile:inset-0",
  );

  const borderClass = "border border-brand-gray-400";
  const flexBetweenClass = "flex items-center justify-between";
  const closeClass = "size-6 cursor-pointer";
  const dotClass = "size-[5px] self-start";

  if (!isOpen || !portalRoot) return null;

  const dropdown = (
    <div className={cn(bgClass, borderClass)}>
      <div className={cn(flexBetweenClass, "mb-4 text-xl font-bold")}>
        <div>알림 {totalCount}개</div>
        <Status.Close onClick={onClose} className={cn(closeClass, "text-brand-black svg-stroke")} />
      </div>

      <div ref={scrollRef} className="scrollbar-hide flex-1 overflow-y-scroll">
        {notifications.length > 0 ? (
          notifications.map((notification: Notification, index: number) => {
            const { id, content, updatedAt } = notification;
            const isApproved = content.includes("승인");
            const statusColor = isApproved ? "text-brand-blue-500" : "text-brand-red-500";
            const isLast = index === notifications.length - 1;

            return (
              <div
                key={id}
                ref={isLast ? targetRef : null}
                className={cn(borderClass, "mb-2 rounded-[5px] bg-white px-3 py-4 font-normal")}
              >
                <div className={cn(flexBetweenClass)}>
                  {isApproved ? (
                    <Status.DotSmallBlue className={dotClass} />
                  ) : (
                    <Status.DotSmallRed className={dotClass} />
                  )}
                  <Status.Close onClick={() => handleDelete(id)} className={closeClass} />
                </div>
                <p className="text-md break-keep">
                  {content.split("예약이")[0]}예약이
                  <span className={statusColor}> {isApproved ? "승인" : "거절"}</span>
                  되었습니다.
                </p>
                <span className="text-brand-gray-600 text-xs">{getTimeAgo(updatedAt)}</span>
              </div>
            );
          })
        ) : (
          <div className="text-brand-gray-600 py-16 text-center text-sm">알림이 없습니다.</div>
        )}
      </div>
    </div>
  );

  return isMobile ? createPortal(dropdown, portalRoot) : dropdown;
}
