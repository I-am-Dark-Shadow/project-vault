import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAllProjects();
      setProjects(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (projectId) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await api.removeProject(projectId);
      // Refetch the project list to ensure UI is in sync
      await fetchProjects();
      return response;
    } catch (err) {
      setError(err);
      console.error("Failed to delete project:", err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    isLoading,
    isDeleting,
    error,
    deleteProject,
    refetch: fetchProjects, // Expose a refetch function
  };
};