const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs'); // Synchronous fs for existsSync and mkdirSync
const ErrorResponse = require('../utils/errorResponse');

// Configure storage for local file system
const storage = (subfolder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
      console.log('uploadsBaseDir: ', uploadsBaseDir);
      const folder = path.join(uploadsBaseDir, subfolder);

      // Ensure the folder exists
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse({ en: 'Only image files are allowed!', ar: 'مسموح بالصور فقط!' }, 400));
  }
};

// Initialize upload middleware
const upload = (subfolder) =>
  multer({
    storage: storage(subfolder),
    limits: { fileSize: process.env.MAX_FILE_SIZE || 2 * 1024 * 1024 }, // Default to 2MB if not set
    fileFilter,
  });

// Middleware to process images and set URLs
const processImage = async (req, res, next) => {
  if (!req.file && (!req.files || Object.keys(req.files).length === 0)) return next();

  const processSingleFile = async (file) => {
    const inputPath = file.path;
    const tempPath = `${inputPath}.tmp`;
    // Construct relative URL from the project root
    const relativeUrl = `/${path
      .relative(path.join(__dirname, '..', '..', '..'), inputPath)
      .replace(/\\/g, '/')}`;

    try {
      await sharp(inputPath)
        .resize(2400, null, { withoutEnlargement: true }) // Keep width at 2400px, maintain aspect ratio
        .jpeg({ quality: 85, mozjpeg: false }) // Lower quality to 85, no optimization
        .png({ quality: 90, compressionLevel: 2 }) // Quality at 90, minimal compression
        .webp({ quality: 85, lossless: false }) // Quality at 85, lossy mode
        .toFile(tempPath);

      await fs.promises.rename(tempPath, inputPath);
      console.log(`Image processed and saved to: ${inputPath}`);

      // Attach the relative URL to the file object
      file.url = relativeUrl;
    } catch (err) {
      console.error('Error processing image:', err);
      if (fs.existsSync(tempPath)) await fs.promises.unlink(tempPath);
      return next(
        new ErrorResponse({ en: 'Error processing image', ar: 'خطأ في برمجة الصورة' }, 500)
      );
    }
  };

  try {
    if (req.file) {
      // Single file upload
      await processSingleFile(req.file);
    } else if (req.files) {
      // Multiple file uploads (array or fields)
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      await Promise.all(files.map(processSingleFile));
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to handle uploads and processing
const uploadAndProcessImages = (subfolder, fieldName, maxCount = 1) => {
  return [
    maxCount > 1
      ? upload(subfolder).array(fieldName, maxCount)
      : upload(subfolder).single(fieldName),
    processImage,
  ];
};

// Export upload middleware
exports.uploadCar = uploadAndProcessImages('cars', 'images', 10); // For multiple car images (up to 10)
exports.uploadOffer = uploadAndProcessImages('offers', 'image'); // For single offer image
exports.uploadHome = upload('home').fields([
  { name: 'whatWeDo', maxCount: 1 },
  { name: 'brands', maxCount: 1 },
  { name: 'news', maxCount: 1 },
  { name: 'showroom', maxCount: 1 },
  { name: 'feedback', maxCount: 1 },
  { name: 'terms', maxCount: 1 },
]);
exports.uploadPartner = uploadAndProcessImages('partners', 'image'); // For single partner image
exports.uploadNews = uploadAndProcessImages('news', 'image'); // For single news image
