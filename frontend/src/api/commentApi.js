import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Task Comment API endpoints (/api/tasks/{taskId}/comments and /api/comments/*)
 */
export const commentApi = {
  /**
   * Get comments for a task
   * GET /api/tasks/{taskId}/comments
   */
  getComments: (taskId) => {
    return apiClient.get(API_ROUTES.TASKS.COMMENTS(taskId));
  },

  /**
   * Post a new comment
   * POST /api/tasks/{taskId}/comments
   * Body: { content }
   */
  createComment: (taskId, content) => {
    return apiClient.post(API_ROUTES.TASKS.COMMENTS(taskId), { content });
  },

  /**
   * Update an existing comment
   * PUT /api/comments/{commentId}
   * Body: { content }
   */
  updateComment: (commentId, content) => {
    return apiClient.put(API_ROUTES.COMMENTS.BY_ID(commentId), { content });
  },

  /**
   * Delete a comment
   * DELETE /api/comments/{commentId}
   */
  deleteComment: (commentId) => {
    return apiClient.delete(API_ROUTES.COMMENTS.BY_ID(commentId));
  },
};
