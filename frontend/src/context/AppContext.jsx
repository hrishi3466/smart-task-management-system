import React, { createContext, useState, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';

export const AppContext = createContext({
  unreadCount: 0,
  toasts: [],
  fetchUnreadCount: async () => {},
  addToast: () => {},
  removeToast: () => {},
});

export const AppProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Toast feedback helper
  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      // response = { unreadCount: number }
      if (response && typeof response.unreadCount === 'number') {
        setUnreadCount(response.unreadCount);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        unreadCount,
        toasts,
        fetchUnreadCount,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
