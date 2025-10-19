"use client";

import { useRef, useState } from "react";

import { Misc } from "@/components/icons";
import NotificationDropDown from "@/components/ui/header/NotificationDropDown";
import useOutsideClick from "@/lib/hooks/useOutsideClick";

export default function Notification() {
  const [isNotification, setIsNotification] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onToggleNotification = () => setIsNotification((prev) => !prev);
  const handleCloseNotification = () => setIsNotification(false);

  useOutsideClick(containerRef, () => {
    if (isNotification) handleCloseNotification();
  });

  return (
    <div ref={containerRef} className="relative">
      <button onClick={onToggleNotification}>
        <Misc.NotificationBell className="size-5" />
      </button>

      <NotificationDropDown isOpen={isNotification} onClose={handleCloseNotification} />
    </div>
  );
}
