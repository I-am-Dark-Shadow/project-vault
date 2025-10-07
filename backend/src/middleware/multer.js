import multer from 'multer';
import path from 'path';

// --- Default: Use memoryStorage to handle files as buffers for cloud uploads ---
const memoryStorage = multer.memoryStorage();

/*
// --- Alternative: Use diskStorage for saving files locally (for dev/testing) ---
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The 'uploads' folder should be in the root of the backend directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
*/

// File filter to allow only .zip files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream' // Often used for zip files
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.zip')) {
    cb(null, true); // Accept file
  } else {
    // Reject file and pass an error
    cb(new Error('Invalid file type. Only .zip files are allowed.'), false);
  }
};

// Configure multer with storage, file filter, and limits
const upload = multer({
  storage: memoryStorage, // Switch to diskStorage for local uploads
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB file size limit
  },
});

export default upload;