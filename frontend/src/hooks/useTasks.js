import { useState, useCallback } from 'react';
import { taskApi } from '../api/taskApi';
import { parseApiError } from '../api/client';

/**
 * Custom hook for task listing and updates within a project
 */
export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (pid = projectId) => {
    if (!pid) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.listTasks(pid);
      setTasks(data || []);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchTaskById = useCallback(async (taskId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.getTask(taskId);
      setCurrentTask(data);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    if (!projectId) return;
    try {
      const newTask = await taskApi.createTask(projectId, taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updated = await taskApi.updateTask(taskId, taskData);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (currentTask?.id === taskId) {
        setCurrentTask(updated);
      }
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (currentTask?.id === taskId) {
        setCurrentTask(null);
      }
    } catch (err) {
      throw err;
    }
  };

  const changeStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      const updated = await taskApi.changeStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      // Revert status update on error
      fetchTasks(projectId);
      throw err;
    }
  };

  const changePriority = async (taskId, newPriority) => {
    try {
      const updated = await taskApi.changePriority(taskId, newPriority);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const changeAssignee = async (taskId, assigneeId) => {
    try {
      const updated = await taskApi.changeAssignee(taskId, assigneeId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updateDueDate = async (taskId, dueDate) => {
    try {
      const updated = await taskApi.updateDueDate(taskId, dueDate);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    changeStatus,
    changePriority,
    changeAssignee,
    updateDueDate,
  };
};
