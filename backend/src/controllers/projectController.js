import  Project  from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

/**
 * @desc    Generate a signature for direct Cloudinary upload
 * @route   POST /api/projects/generate-signature
 * @access  Public
 */
export const generateSignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // This creates a signature that is valid for a short time.
    // The frontend will use this to authenticate its direct upload request to Cloudinary.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'project-vault', // Optional: specify a folder
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ message: 'Server error while generating signature.' });
  }
};


/**
 * @desc    Create a new project entry in the database (WITHOUT file upload)
 * @route   POST /api/projects
 * @access  Public
 */
export const createProject = async (req, res) => {
  // This function no longer handles file uploads.
  // It only receives the file details AFTER the frontend has uploaded it to Cloudinary.
  const { name, description, fileUrl, filePublicId, originalFileName } = req.body;

  if (!name || !fileUrl || !filePublicId || !originalFileName) {
    return res.status(400).json({ message: 'Missing required project data.' });
  }

  try {
    const newProject = new Project({
      name,
      description,
      fileUrl,
      filePublicId,
      originalFileName,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);

  } catch (error)
  {
    console.error('Error creating project entry:', error);
    res.status(500).json({ message: 'Server error while creating project entry.' });
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Public
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await cloudinary.uploader.destroy(project.filePublicId, {
      resource_type: 'raw',
    });

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error while deleting project.' });
  }
};

/**
 * @desc    Get a download URL or stream the file
 * @route   GET /api/projects/:id/download
 * @access  Public
 */
export const downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.redirect(project.fileUrl);
  } catch (error) {
    console.error('Error getting download link:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};