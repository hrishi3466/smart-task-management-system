import { useState, useCallback } from 'react';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import { useAuth } from './useAuth';
import { parseApiError } from '../api/client';

/**
 * Isolated hook for aggregating tasks assigned to current user across accessible projects
 */
export const useMyTasks = () => {
  const { currentUser } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyTasks = useCallback(async () => {
    if (!currentUser) return [];
    setIsLoading(true);
    setError(null);
    try {
      const projects = await projectApi.listProjects();
      if (!projects || projects.length === 0) {
        setMyTasks([]);
        return [];
      }

      // Fetch tasks for each accessible project sequentially to prevent connection flooding
      const aggregatedTasks = [];
      for (const proj of projects) {
        try {
          const projectTasks = await taskApi.listTasks(proj.id);
          if (Array.isArray(projectTasks)) {
            const assigned = projectTasks.filter(
              (t) => t.assignee && t.assignee.id === currentUser.id
            );
            aggregatedTasks.push(...assigned);
          }
        } catch {
          // Continue fetching from other projects if one fails
        }
      }

      setMyTasks(aggregatedTasks);
      return aggregatedTasks;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  return {
    myTasks,
    isLoading,
    error,
    fetchMyTasks,
  };
};
