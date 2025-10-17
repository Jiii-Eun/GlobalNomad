"use client";

import { useState } from "react";

import { Misc } from "@/components/icons";
import NotificationDropDown from "@/components/ui/header/NotificationDropDown";

export default function Notification() {
  const [isNotification, setIsNotification] = useState(false);

  const onToggleNotification = () => setIsNotification((prev) => !prev);
  const handleCloseNotification = () => setIsNotification(false);

  return (
    <div className="relative">
      <button onClick={onToggleNotification}>
        <Misc.NotificationBell className="size-5" />
      </button>
      <NotificationDropDown isOpen={isNotification} onClose={handleCloseNotification} />
    </div>
  );
}
