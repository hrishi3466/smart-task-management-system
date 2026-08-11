import { useState, useCallback } from 'react';
import { projectApi } from '../api/projectApi';
import { parseApiError } from '../api/client';

/**
 * Custom hook for fetching and managing projects
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectApi.listProjects();
      setProjects(data || []);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProjectById = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectApi.getProject(projectId);
      setCurrentProject(data);
      return data;
    } catch (err) {
      const msg = parseApiError(err);
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = async (projectData) => {
    try {
      const newProject = await projectApi.createProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      throw err;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const updated = await projectApi.updateProject(projectId, projectData);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      if (currentProject?.id === projectId) {
        setCurrentProject(updated);
      }
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await projectApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      throw err;
    }
  };

  const addMember = async (projectId, memberData) => {
    try {
      const updatedProject = await projectApi.addMember(projectId, memberData);
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  const removeMember = async (projectId, userId) => {
    try {
      const updatedProject = await projectApi.removeMember(projectId, userId);
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      throw err;
    }
  };

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  };
};
