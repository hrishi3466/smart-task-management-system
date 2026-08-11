import { useState, useCallback, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { parseApiError } from '../api/client';

/**
 * Custom hook for notifications listing, marking as read, and optional polling
 */
export const useNotifications = (pollingIntervalMs = 30000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data || []);
      const count = (data || []).filter((n) => !n.readStatus).length;
      setUnreadCount(count);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      if (res && typeof res.unreadCount === 'number') {
        setUnreadCount(res.unreadCount);
      }
    } catch {
      // Ignore background errors
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const updated = await notificationApi.markAsRead(notificationId);
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === notificationId);
        if (target && !target.readStatus) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.map((n) => (n.id === notificationId ? updated : n));
      });
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readStatus: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === notificationId);
        if (target && !target.readStatus) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (err) {
      throw err;
    }
  };

  // Controlled polling interval
  useEffect(() => {
    if (!pollingIntervalMs) return;
    const timer = setInterval(() => {
      fetchUnreadCount();
    }, pollingIntervalMs);
    return () => clearInterval(timer);
  }, [pollingIntervalMs, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
