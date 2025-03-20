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
  const filetypes = /jpeg|jpg|png|webp/;
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
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto:good' }, // Reduce quality for smaller file size
      { fetch_format: 'auto' }, // Automatically use the best format (e.g., webp)
    ],
  },
});

// Configure storage for home
const storageHome = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/home',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  },
});

// Configure storage for offers
const storageOffer = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/offers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  },
});

// Configure storage for news
const storageNews = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/news',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  },
});

// Configure storage for partners
const storagePartners = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/partners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  },
});

// Initialize upload middleware
exports.uploadCar = multer({
  storage: storageCar,
  limits: { fileSize: process.env.MAX_FILE_SIZE }, // 2 MB limit
  fileFilter: fileFilter,
});

exports.uploadOffer = multer({
  storage: storageOffer,
  limits: { fileSize: process.env.MAX_FILE_SIZE }, // 2 MB limit
  fileFilter: fileFilter,
});

exports.uploadHome = multer({
  storage: storageHome,
  limits: { fileSize: process.env.MAX_FILE_SIZE }, // 2 MB limit
  fileFilter: fileFilter,
}).fields([
  { name: 'whatWeDo', maxCount: 1 },
  { name: 'brands', maxCount: 1 },
  { name: 'news', maxCount: 1 },
  { name: 'showroom', maxCount: 1 },
]);

exports.uploadPartner = multer({
  storage: storagePartners,
  limits: { fileSize: process.env.MAX_FILE_SIZE }, // 2 MB limit
  fileFilter: fileFilter,
});

exports.uploadNews = multer({
  storage: storageNews,
  limits: { fileSize: process.env.MAX_FILE_SIZE }, // 2 MB limit
  fileFilter: fileFilter,
});
