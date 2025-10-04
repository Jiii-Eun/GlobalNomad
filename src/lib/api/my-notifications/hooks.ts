import { useApiMutation, ApiMutationOptions } from "@/lib/hooks/useApiMutation";
import { useFetchQuery, FetchQueryOptions } from "@/lib/hooks/useFetchQuery";

import { getMyNotifications, deleteMyNotification } from "./api";
import { GetNotifsReq, GetNotifsRes, DeleteNotifReq } from "./types";

//GET: 내 알림 리스트 조회
export function useMyNotifications(
  params: GetNotifsReq,
  isMock = false,
  options?: FetchQueryOptions<GetNotifsRes>,
) {
  return useFetchQuery<GetNotifsRes>(
    ["myNotifications", params],
    isMock ? undefined : () => getMyNotifications(params),
    {
      mockData: isMock ? { cursorId: 0, totalCount: 1, notifications: [] } : undefined,
      ...options,
    },
  );
}

//DELETE: 내 알림 삭제
export function useDeleteMyNotification(
  isMock = false,
  options?: ApiMutationOptions<null, DeleteNotifReq>,
) {
  return useApiMutation<null, DeleteNotifReq>(
    isMock ? undefined : (data) => deleteMyNotification(data),
    {
      mockResponse: isMock ? null : undefined,
      ...options,
    },
  );
}
