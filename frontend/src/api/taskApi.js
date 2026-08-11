import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Task API endpoints (/api/projects/{projectId}/tasks and /api/tasks/*)
 */
export const taskApi = {
  /**
   * List tasks for a specific project
   * GET /api/projects/{projectId}/tasks
   */
  listTasks: (projectId) => {
    return apiClient.get(API_ROUTES.PROJECTS.TASKS(projectId));
  },

  /**
   * Create a new task inside a project
   * POST /api/projects/{projectId}/tasks
   * Body: { title, description, priority, assigneeId, dueDate }
   */
  createTask: (projectId, taskData) => {
    return apiClient.post(API_ROUTES.PROJECTS.TASKS(projectId), taskData);
  },

  /**
   * Get task by ID
   * GET /api/tasks/{taskId}
   */
  getTask: (taskId) => {
    return apiClient.get(API_ROUTES.TASKS.BY_ID(taskId));
  },

  /**
   * Full update of a task
   * PUT /api/tasks/{taskId}
   * Body: { title, description, status, priority, assigneeId, dueDate }
   */
  updateTask: (taskId, taskData) => {
    return apiClient.put(API_ROUTES.TASKS.BY_ID(taskId), taskData);
  },

  /**
   * Delete a task
   * DELETE /api/tasks/{taskId}
   */
  deleteTask: (taskId) => {
    return apiClient.delete(API_ROUTES.TASKS.BY_ID(taskId));
  },

  /**
   * Update task assignee
   * PATCH /api/tasks/{taskId}/assignee
   * Body: { assigneeId }
   */
  changeAssignee: (taskId, assigneeId) => {
    return apiClient.patch(API_ROUTES.TASKS.ASSIGNEE(taskId), { assigneeId });
  },

  /**
   * Update task status (Kanban drag and drop)
   * PATCH /api/tasks/{taskId}/status
   * Body: { status }
   */
  changeStatus: (taskId, status) => {
    return apiClient.patch(API_ROUTES.TASKS.STATUS(taskId), { status });
  },

  /**
   * Update task priority
   * PATCH /api/tasks/{taskId}/priority
   * Body: { priority }
   */
  changePriority: (taskId, priority) => {
    return apiClient.patch(API_ROUTES.TASKS.PRIORITY(taskId), { priority });
  },

  /**
   * Update task due date
   * PATCH /api/tasks/{taskId}/due-date
   * Body: { dueDate }
   */
  updateDueDate: (taskId, dueDate) => {
    return apiClient.patch(API_ROUTES.TASKS.DUE_DATE(taskId), { dueDate });
  },
};
