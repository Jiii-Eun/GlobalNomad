import { z } from "zod";

// GET: 내 알림 리스트 조회 요청
export const GetNotifsReqSchema = z.object({
  cursorId: z.number().optional(),
  size: z.number().optional(),
});
export type GetNotifsReq = z.infer<typeof GetNotifsReqSchema>;

// GET: 내 알림 리스트 조회 응답
export const NotificationSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const GetNotifsResSchema = z.object({
  cursorId: z.number().nullable(),
  notifications: z.array(NotificationSchema),
  totalCount: z.number(),
});
export type GetNotifsRes = z.infer<typeof GetNotifsResSchema>;

// DELETE: 내 알림 삭제 요청
export const DeleteNotifReqSchema = z.object({
  notificationId: z.number(),
});
export type DeleteNotifReq = z.infer<typeof DeleteNotifReqSchema>;
