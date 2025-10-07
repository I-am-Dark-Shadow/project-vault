import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import projectRoutes from './src/routes/projectRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// --- Middleware ---

// 1. CORS (Cross-Origin Resource Sharing)
// This allows the frontend (running on a different origin) to make requests to this backend.
const corsOptions = {
  //origin: process.env.FRONTEND_URL, // Only allow requests from this origin
  origin: 'https://project-vault-pro.vercel.app',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2. Body Parsers
// This allows the server to accept and parse JSON in the request body.
app.use(express.json());
// This allows the server to parse URL-encoded form data.
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---

// All routes related to projects will be prefixed with /api/projects
app.use('/api/projects', projectRoutes);

// --- Basic Root Route for Health Check ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Project Vault API' });
});

// --- Custom Error Handling Middleware (for Multer) ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // An unknown error occurred (like the file filter error).
    if (err.message === 'Invalid file type. Only .zip files are allowed.') {
       return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
  next();
});


// --- Start Server ---

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});