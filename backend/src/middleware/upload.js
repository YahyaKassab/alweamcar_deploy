const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Configure storage with debug
const storage = (subfolder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadsBaseDir = path.join(__dirname, '..', '..', 'public', 'uploads');
      const folder = path.join(uploadsBaseDir, subfolder);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      console.log(`[${new Date().toISOString()}] Storage destination set: ${folder}`);
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
      console.log(
        `[${new Date().toISOString()}] Filename generated: ${filename} for ${file.originalname}`
      );
      cb(null, filename);
    },
  });

// File filter with debug
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    console.log(`[${new Date().toISOString()}] File type accepted: ${file.mimetype}`);
    cb(null, true);
  } else {
    console.log(`[${new Date().toISOString()}] File type rejected: ${file.mimetype}`);
    cb(new ErrorResponse({ en: 'Only image files are allowed!', ar: 'مسموح بالصور فقط!' }, 400));
  }
};

// Initialize upload with timing wrapper
const upload = (subfolder) => {
  const multerInstance = multer({
    storage: storage(subfolder),
    limits: { fileSize: process.env.MAX_FILE_SIZE || 2 * 1024 * 1024 },
    fileFilter,
  });

  return (req, res, next) => {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Starting Multer upload for ${subfolder}`);
    multerInstance(req, res, (err) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] Multer error: ${err.message}`);
        return next(err);
      }
      const endTime = Date.now();
      console.log(
        `[${new Date().toISOString()}] Multer upload for ${subfolder} completed, ` +
          `Time: ${(endTime - startTime) / 1000} seconds`
      );
      next();
    });
  };
};

// Process images in parallel with debug
const processImage = async (req, res, next) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting image processing`);

  if (!req.file && (!req.files || Object.keys(req.files).length === 0)) {
    console.log(`[${new Date().toISOString()}] No files to process`);
    return next();
  }

  const processSingleFile = async (file) => {
    const fileStartTime = Date.now();
    console.log(`[${new Date().toISOString()}] Processing file: ${file.originalname}`);

    const inputPath = file.path;
    const tempPath = `${inputPath}.tmp`;
    const subfolder = path.basename(path.dirname(inputPath));
    const filename = path.basename(inputPath);
    const relativeUrl = `/uploads/${subfolder}/${filename}`;

    try {
      await sharp(inputPath)
        .resize(2400, null, { withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: false })
        .png({ quality: 90, compressionLevel: 2 })
        .webp({ quality: 85, lossless: false })
        .toFile(tempPath);

      await fs.promises.rename(tempPath, inputPath);
      file.url = relativeUrl;

      const fileEndTime = Date.now();
      console.log(
        `[${new Date().toISOString()}] File processed and saved: ${inputPath}, ` +
          `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB, ` +
          `Time: ${(fileEndTime - fileStartTime) / 1000} seconds`
      );
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Error processing ${file.originalname}:`,
        err.message
      );
      if (fs.existsSync(tempPath)) await fs.promises.unlink(tempPath);
      throw err;
    }
  };

  try {
    if (req.file) {
      await processSingleFile(req.file);
    } else if (req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      console.log(`[${new Date().toISOString()}] Processing ${files.length} files in parallel`);
      await Promise.all(files.map(processSingleFile));
    }
    const endTime = Date.now();
    console.log(
      `[${new Date().toISOString()}] Image processing completed, ` +
        `Total time: ${(endTime - startTime) / 1000} seconds`
    );
    next();
  } catch (err) {
    next(new ErrorResponse({ en: 'Error processing image', ar: 'خطأ في معالجة الصورة' }, 500));
  }
};

// Log uploadHome with full timing
const logUploadHome = async (req, res, next) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Starting uploadHome`);

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log(`[${new Date().toISOString()}] No files uploaded for home`);
    return next();
  }

  console.log(`[${new Date().toISOString()}] Files saved for uploadHome:`);
  const files = Object.values(req.files).flat();
  files.forEach((file) => {
    const details = {
      fieldName: file.fieldname,
      originalName: file.originalname,
      savedPath: file.path,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: `/uploads/home/${file.filename}`,
    };
    console.log(JSON.stringify(details, null, 2));
  });

  const endTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] uploadHome completed, ` +
      `Total time: ${(endTime - startTime) / 1000} seconds`
  );
  next();
};

// Upload and process with timing
const uploadAndProcessImages = (subfolder, fieldName, maxCount = 1) => {
  return [
    upload(subfolder)(
      maxCount > 1
        ? upload(subfolder).array(fieldName, maxCount)
        : upload(subfolder).single(fieldName)
    ),
    processImage,
  ];
};

// Export middleware
exports.uploadCar = uploadAndProcessImages('cars', 'images', 10);
exports.uploadOffer = uploadAndProcessImages('offers', 'image');
exports.uploadHome = [
  upload('home').fields([
    { name: 'whatWeDo', maxCount: 1 },
    { name: 'brands', maxCount: 1 },
    { name: 'news', maxCount: 1 },
    { name: 'showroom', maxCount: 1 },
    { name: 'feedback', maxCount: 1 },
    { name: 'terms', maxCount: 1 },
  ]),
  logUploadHome,
];
exports.uploadPartner = uploadAndProcessImages('partners', 'image');
exports.uploadNews = uploadAndProcessImages('news', 'image');
