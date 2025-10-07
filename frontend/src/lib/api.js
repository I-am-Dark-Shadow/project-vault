import axios from 'axios';

// Create an Axios instance with a base URL from environment variables.
// Vite uses the `VITE_` prefix for environment variables exposed to the client.
const apiClient = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  baseURL: 'https://project-vault-backend.vercel.app/api',
  withCredentials: true,
});

// A helper to handle API errors consistently.
const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred.';
  console.error('API Error:', error.response || error);
  // Throw an error with a user-friendly message
  throw new Error(message);
};

/**
 * Fetches all projects from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of projects.
 */
export const getAllProjects = async () => {
  try {
    const response = await apiClient.get('/projects');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Uploads a new project.
 * @param {FormData} formData - The form data containing the project name, description, and .zip file.
 * @returns {Promise<Object>} A promise that resolves to the newly created project object.
 */
export const createProject = async (formData) => {
  try {
    const response = await apiClient.post('/projects', formData, {
      headers: {
        // Axios sets the correct multipart boundary automatically with FormData
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Deletes a project by its ID.
 * @param {string} projectId - The ID of the project to delete.
 * @returns {Promise<Object>} A promise that resolves to the success message from the server.
 */
export const removeProject = async (projectId) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};