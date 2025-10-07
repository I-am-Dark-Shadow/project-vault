import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true, // URL from the cloud storage provider (e.g., Cloudinary)
    },
    filePublicId: {
      type: String,
      required: true, // Unique ID from Cloudinary to manage the file
    },
    originalFileName: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;