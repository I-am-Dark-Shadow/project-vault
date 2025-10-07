import express from 'express';
import {
  createProject,
  getProjects,
  deleteProject,
  downloadProject,
  generateSignature,
} from '../controllers/projectController.js';

const router = express.Router();

// Route for generating the signature needed for direct uploads
router.route('/generate-signature').post(generateSignature);

// Route for getting all projects and creating a new project entry (metadata only)
router
  .route('/')
  .get(getProjects)
  .post(createProject); // This no longer uses multer for file uploads

// Route for deleting a specific project
router.route('/:id').delete(deleteProject);

// Route for downloading a specific project's file
router.route('/:id/download').get(downloadProject);

export default router;