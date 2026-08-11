import { apiClient } from './client';
import { API_ROUTES } from '../constants/apiRoutes';

/**
 * Project and Team Member API endpoints (/api/projects/*)
 */
export const projectApi = {
  /**
   * List all accessible projects
   * GET /api/projects
   */
  listProjects: () => {
    return apiClient.get(API_ROUTES.PROJECTS.BASE);
  },

  /**
   * Get single project by ID
   * GET /api/projects/{projectId}
   */
  getProject: (projectId) => {
    return apiClient.get(API_ROUTES.PROJECTS.BY_ID(projectId));
  },

  /**
   * Create a new project
   * POST /api/projects
   * Body: { name, description }
   */
  createProject: (projectData) => {
    return apiClient.post(API_ROUTES.PROJECTS.BASE, projectData);
  },

  /**
   * Update an existing project
   * PUT /api/projects/{projectId}
   * Body: { name, description, status }
   */
  updateProject: (projectId, projectData) => {
    return apiClient.put(API_ROUTES.PROJECTS.BY_ID(projectId), projectData);
  },

  /**
   * Delete a project
   * DELETE /api/projects/{projectId}
   */
  deleteProject: (projectId) => {
    return apiClient.delete(API_ROUTES.PROJECTS.BY_ID(projectId));
  },

  /**
   * Add a team member to a project
   * POST /api/projects/{projectId}/members
   * Body: { email, role }
   */
  addMember: (projectId, memberData) => {
    return apiClient.post(API_ROUTES.PROJECTS.MEMBERS(projectId), memberData);
  },

  /**
   * Remove a member from a project
   * DELETE /api/projects/{projectId}/members/{userId}
   */
  removeMember: (projectId, userId) => {
    return apiClient.delete(API_ROUTES.PROJECTS.MEMBER_BY_ID(projectId, userId));
  },
};
