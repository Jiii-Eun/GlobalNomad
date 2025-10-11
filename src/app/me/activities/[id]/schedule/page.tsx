"use client";
import { useState } from "react";

import TimeSlotPicker from "@/app/me/components/TimeSlotPicker";

export default function Schedule() {
  const [parentSelectedDate, setParentSelectedDate] = useState<Date | null>(null);

  const handleSelectedDateChange = (date: Date | null) => setParentSelectedDate(date);

  return (
    <div>
      <TimeSlotPicker
        selectDate={parentSelectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />
    </div>
  );
}
