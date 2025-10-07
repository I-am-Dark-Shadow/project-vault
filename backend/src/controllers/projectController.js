import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import path from 'path';

// Helper function to upload a buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const public_id = `${path.parse(fileName).name}_${Date.now()}`;

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'project-vault',
                resource_type: 'raw',
                public_id: public_id,
                // ADD THIS LINE to ensure the file is publicly accessible
                type: 'upload',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

/**
 * @desc    Upload a new project
 * @route   POST /api/projects
 * @access  Public
 */
export const uploadProject = async (req, res) => {
    const { name, description } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a .zip file.' });
    }

    try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

        const newProject = new Project({
            name: name || 'Untitled Project',
            description,
            fileUrl: result.secure_url,
            filePublicId: result.public_id,
            originalFileName: req.file.originalname,
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);

    } catch (error) {
        console.error('Error uploading project:', error);
        res.status(500).json({ message: 'Server error during file upload.' });
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
            return res.status(4.04).json({ message: 'Project not found.' });
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
            return res.status(4.04).json({ message: 'Project not found.' });
        }
        res.redirect(project.fileUrl);
    } catch (error) {
        console.error('Error getting download link:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};