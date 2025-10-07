import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
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

  const addProject = async (formData) => {
    setIsAdding(true);
    setError(null);
    try {
      const newProject = await api.createProject(formData);
      setProjects((prevProjects) => [newProject, ...prevProjects]);
      return newProject; // Return data for toast success
    } catch (err) {
      setError(err);
      console.error("Failed to add project:", err);
      // Re-throw the error to be caught by toast.promise
      throw err; 
    } finally {
      setIsAdding(false);
    }
  };

  const deleteProject = async (projectId) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await api.removeProject(projectId);
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p._id !== projectId)
      );
      return response; // Return data for toast success
    } catch (err) {
      setError(err);
      console.error("Failed to delete project:", err);
      // Re-throw the error
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    isLoading,
    isAdding,
    isDeleting,
    error,
    addProject,
    deleteProject,
    refetch: fetchProjects, // Expose a refetch function
  };
};