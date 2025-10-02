import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import { getMyNotifications, deleteMyNotification } from "./api";
import {
  GetMyNotificationsRequest,
  GetMyNotificationsResponse,
  DeleteMyNotificationRequest,
} from "./types";

/** GET: 내 알림 리스트 조회 */
export function useMyNotifications(
  params: GetMyNotificationsRequest,
  isMock = false,
  options?: FetchQueryOptions<GetMyNotificationsResponse>,
) {
  return useFetchQuery<GetMyNotificationsResponse>(
    ["myNotifications", params],
    isMock ? undefined : () => getMyNotifications(params),
    {
      mockData: isMock ? { cursorId: 0, totalCount: 1, notifications: [] } : undefined,
      ...options,
    },
  );
}

/** DELETE: 내 알림 삭제 */
export function useDeleteMyNotification(
  isMock = false,
  options?: ApiMutationOptions<null, DeleteMyNotificationRequest>,
) {
  return useApiMutation<null, DeleteMyNotificationRequest>(
    isMock ? undefined : (data) => deleteMyNotification(data),
    {
      mockResponse: isMock ? null : undefined,
      ...options,
    },
  );
}
