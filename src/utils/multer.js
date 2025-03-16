const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the directories
const uploadDir = path.join(__dirname, "..", "uploads");
const imagesDir = path.join(uploadDir, "images");
const videosDir = path.join(uploadDir, "videos");

// Create directories if they don't exist
const createDirectories = () => {
  [uploadDir, imagesDir, videosDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createDirectories(); // Ensure directories exist

    if (file.mimetype.startsWith("image/")) {
      cb(null, imagesDir);
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videosDir);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for images and videos only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

// Define the upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file limit
});

// Middleware for handling single and multiple file uploads
module.exports = {
  upload, // General upload middleware
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  uploadFields: upload.fields([
    { name: "profile_photo", maxCount: 1 }, // Single profile photo
    { name: "images", maxCount: 10 }, // Up to 10 images
    { name: "videos", maxCount: 1 }, // Up to 5 videos
  ]),
};
