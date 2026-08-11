import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Authentication API endpoints (/api/auth/*)
 */
export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   * Body: { name, email, password }
   */
  register: (registerData) => {
    return apiClient.post(API_ROUTES.AUTH.REGISTER, registerData);
  },

  /**
   * Log in an existing user
   * POST /api/auth/login
   * Body: { email, password }
   */
  login: (credentials) => {
    return apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
  },
};
