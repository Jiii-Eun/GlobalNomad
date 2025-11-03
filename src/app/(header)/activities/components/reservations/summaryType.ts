export interface ReserveSummary {
  dateText?: string; // 예: "2025-11-14"
  timeText?: string; // 예: "14:00~15:00" (복수면 "14:00~15:00 외 N건")
  members: number; // 1회(슬롯) 기준 인원
  totalMembers: number; // 총 인원 = members * 예약 슬롯 수
  totalPrice: number; // 총 금액 = price * members * 예약 슬롯 수 (선택 전엔 1인 가격)
}
