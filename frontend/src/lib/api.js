import axios from 'axios';

// Get backend URL from environment variables
const apiClient = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  baseURL: 'https://project-vault-backend.vercel.app/api',
});

// A helper to handle API errors consistently.
const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred.';
  console.error('API Error:', error.response || error);
  throw new Error(message);
};

// --- NEW STEP 1: Get upload signature from our backend ---
export const generateUploadSignature = async () => {
  try {
    const response = await apiClient.post('/projects/generate-signature');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// --- NEW STEP 2: Upload the file directly to Cloudinary ---
export const uploadFileToCloudinary = async (file, signatureData) => {
  const formData = new FormData();
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`;

  formData.append('file', file);
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
  formData.append('timestamp', signatureData.timestamp);
  formData.append('signature', signatureData.signature);
  formData.append('folder', 'project-vault'); // Optional: same folder as in backend

  try {
    // This request goes directly to Cloudinary, not our backend.
    const response = await axios.post(cloudinaryUrl, formData);
    return response.data; // This contains the secure_url, public_id, etc.
  } catch (error) {
    handleError(error);
  }
};


// --- MODIFIED STEP 3: Create the project entry in our database ---
/**
 * Saves project metadata to our database.
 * @param {Object} projectData - An object with name, description, fileUrl, etc.
 * @returns {Promise<Object>} A promise that resolves to the newly created project object.
 */
export const createProject = async (projectData) => {
  try {
    // This now sends simple JSON, not a large file.
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


// --- UNCHANGED FUNCTIONS ---

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