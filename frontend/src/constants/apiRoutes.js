/**
 * Centralized API route mappings corresponding directly to API_INTEGRATION_MAP.md
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USER: {
    ME: '/users/me',
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    MEMBERS: (id) => `/projects/${id}/members`,
    MEMBER_BY_ID: (projectId, userId) => `/projects/${projectId}/members/${userId}`,
    TASKS: (projectId) => `/projects/${projectId}/tasks`,
  },
  TASKS: {
    BY_ID: (id) => `/tasks/${id}`,
    ASSIGNEE: (id) => `/tasks/${id}/assignee`,
    STATUS: (id) => `/tasks/${id}/status`,
    PRIORITY: (id) => `/tasks/${id}/priority`,
    DUE_DATE: (id) => `/tasks/${id}/due-date`,
    COMMENTS: (id) => `/tasks/${id}/comments`,
  },
  COMMENTS: {
    BY_ID: (id) => `/comments/${id}`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    BY_ID: (id) => `/notifications/${id}`,
  },
};
