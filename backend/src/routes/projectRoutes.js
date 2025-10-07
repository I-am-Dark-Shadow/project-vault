import express from 'express';
import {
  uploadProject,
  getProjects,
  deleteProject,
  downloadProject,
} from '../controllers/projectController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Route for getting all projects and uploading a new one
router
  .route('/')
  .get(getProjects)
  // The middleware 'upload.single('projectFile')' processes the file upload.
  // 'projectFile' must match the 'name' attribute of the file input in the frontend form.
  .post(upload.single('projectFile'), uploadProject);

// Route for deleting a specific project
router.route('/:id').delete(deleteProject);

// Route for downloading a specific project's file
router.route('/:id/download').get(downloadProject);

export default router;