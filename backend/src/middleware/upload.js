const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|webp/;
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files are allowed!', 400));
  }
};

// Configure storage for cars
const storageCar = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/cars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});
// Configure storage for cars
const storageHome = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/home',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

// Configure storage for offers
const storageOffer = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/offers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

// Configure storage for news
const storageNews = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/news',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

// Initialize upload middleware
exports.uploadCar = multer({
  storage: storageCar,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 }, // Default to 5MB
  fileFilter: fileFilter,
});

exports.uploadOffer = multer({
  storage: storageOffer,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 },
  fileFilter: fileFilter,
});

exports.uploadHome = multer({ storageHome }).fields([
  { name: 'whatWeDo', maxCount: 1 },
  { name: 'brands', maxCount: 1 },
  { name: 'news', maxCount: 1 },
  { name: 'showroom', maxCount: 1 },
]);

exports.uploadNews = multer({
  storage: storageNews,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 },
  fileFilter: fileFilter,
});
