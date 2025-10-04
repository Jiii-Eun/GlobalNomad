import { apiRequest } from "@/lib/apiRequest";
import { toQueryString } from "@/lib/utills/queryString";

import { GetNotifsReq, GetNotifsRes, GetNotifsResSchema, DeleteNotifReq } from "./types";

// GET: 내 알림 리스트 조회
export function getMyNotifications(params: GetNotifsReq) {
  const query = toQueryString(params);
  return apiRequest<GetNotifsRes>(`/my-notifications?${query}`, {
    schema: GetNotifsResSchema,
  });
}

// DELETE: 내 알림 삭제
export function deleteMyNotification(data: DeleteNotifReq) {
  return apiRequest<null>(`/my-notifications/${data.notificationId}`, {
    method: "DELETE",
  });
}
