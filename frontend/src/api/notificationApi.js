import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Notification API endpoints (/api/notifications/*)
 */
export const notificationApi = {
  /**
   * Fetch all notifications for current user
   * GET /api/notifications
   */
  getNotifications: () => {
    return apiClient.get(API_ROUTES.NOTIFICATIONS.BASE);
  },

  /**
   * Fetch unread notification count
   * GET /api/notifications/unread-count
   */
  getUnreadCount: () => {
    return apiClient.get(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT);
  },

  /**
   * Mark single notification as read
   * PUT /api/notifications/{notificationId}/read
   */
  markAsRead: (notificationId) => {
    return apiClient.put(API_ROUTES.NOTIFICATIONS.MARK_READ(notificationId));
  },

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  markAllAsRead: () => {
    return apiClient.put(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },

  /**
   * Delete a notification
   * DELETE /api/notifications/{notificationId}
   */
  deleteNotification: (notificationId) => {
    return apiClient.delete(API_ROUTES.NOTIFICATIONS.BY_ID(notificationId));
  },
};
