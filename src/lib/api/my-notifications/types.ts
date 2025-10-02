import { z } from "zod";

// GET: 내 알림 리스트 조회 요청
export const GetMyNotificationsRequestSchema = z.object({
  teamId: z.string(),
  cursorId: z.number().optional(),
  size: z.number().optional(),
});
export type GetMyNotificationsRequest = z.infer<typeof GetMyNotificationsRequestSchema>;

// GET: 내 알림 리스트 조회 응답
export const NotificationSchema = z.object({
  id: z.number(),
  teamId: z.string(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().optional(),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const GetMyNotificationsResponseSchema = z.object({
  cursorId: z.number(),
  notifications: z.array(NotificationSchema),
  totalCount: z.number(),
});
export type GetMyNotificationsResponse = z.infer<typeof GetMyNotificationsResponseSchema>;

// DELETE: 내 알림 삭제 요청
export const DeleteMyNotificationRequestSchema = z.object({
  teamId: z.string(),
  notificationId: z.number(),
});
export type DeleteMyNotificationRequest = z.infer<typeof DeleteMyNotificationRequestSchema>;
