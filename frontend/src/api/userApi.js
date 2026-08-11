import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * User API endpoints (/api/users/*)
 */
export const userApi = {
  /**
   * Fetch current authenticated user details
   * GET /api/users/me
   */
  getCurrentUser: () => {
    return apiClient.get(API_ROUTES.USER.ME);
  },
};
