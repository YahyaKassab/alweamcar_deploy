const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Partner = require('../models/partner');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const messages = require('../locales/messages');
const multer = require('multer');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirPartners = path.join(uploadsBaseDir, 'partners');

// Ensure partners directory exists
const ensureDirectory = () => {
  try {
    if (!fs.existsSync(imagesDestDirPartners)) {
      fs.mkdirSync(imagesDestDirPartners, { recursive: true });
      console.log(`Created directory: ${imagesDestDirPartners}`);
    }
  } catch (error) {
    console.error(`Failed to create directory ${imagesDestDirPartners}:`, error);
    throw new Error(
      { en: 'Unable to create upload directory', ar: 'غير قادر على إنشاء مجلد التحميل' },
      400
    );
  }
};

// Configure storage to keep files in memory
const storagePartners = multer.memoryStorage();

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ErrorResponse(messages.invalidFileType, 400), false);
  }
  cb(null, true);
};

// Multer upload configuration
exports.uploadPartners = multer({
  storage: storagePartners,
  fileFilter: fileFilter,
});

// Utility function to process and save image
const processImage = async (file) => {
  ensureDirectory();
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = `image-${uniqueSuffix}${path.extname(file.originalname)}`;
  const finalPath = path.join(imagesDestDirPartners, filename);

  console.log(`Attempting to save image to: ${finalPath}`);

  const fileSizeInMB = file.size / (1024 * 1024);
  let buffer = file.buffer;

  try {
    if (fileSizeInMB > 1) {
      buffer = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const resizedSizeInMB = buffer.length / (1024 * 1024);
      if (resizedSizeInMB > 1) {
        throw new ErrorResponse(
          {
            en: `Image could not be resized below 1MB (${resizedSizeInMB.toFixed(2)}MB)`,
            ar: `الصورة لا تتجاوز الحد الأقصى 1MB (${resizedSizeInMB.toFixed(2)}MB)`,
          },
          400
        );
      }
    }

    fs.writeFileSync(finalPath, buffer);
    if (!fs.existsSync(finalPath)) {
      throw new ErrorResponse(
        { en: `File was not written to ${finalPath}`, ar: `الملف لم يكتب في ${finalPath}` },
        400
      );
    }
    console.log(`Successfully saved image: ${finalPath}`);
  } catch (error) {
    console.error(`Failed to process/save image to ${finalPath}:`, error);
    throw error;
  }

  return `/uploads/partners/${filename}`;
};

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private (Admin only)
exports.createPartner = asyncHandler(async (req, res, next) => {
  const { name, url } = req.body;

  if (!name || !url) {
    return next(new ErrorResponse(messages.requiredFieldsMissing, 400));
  }

  let imageUrl;
  if (req.file) {
    try {
      imageUrl = await processImage(req.file);
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  } else {
    return next(new ErrorResponse(messages.imageRequired, 400));
  }

  const partner = await Partner.create({
    name: name.trim(),
    url: url.trim(),
    image: imageUrl,
  });

  res.status(201).json({
    success: true,
    data: partner,
  });
});

// @desc    Get all partners with pagination
// @route   GET /api/partners
// @access  Public
exports.getPartners = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const total = await Partner.countDocuments();
  const partners = await Partner.find().skip(skip).limit(parseInt(limit, 10)).sort('name');

  res.status(200).json({
    success: true,
    count: partners.length,
    total,
    pagination: {
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      pageSize: parseInt(limit, 10),
    },
    data: partners,
  });
});

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private (Admin only)
exports.updatePartner = asyncHandler(async (req, res, next) => {
  let partner = await Partner.findById(req.params.id);
  if (!partner) return next(new ErrorResponse(messages.notFound, 404));

  const { name, url } = req.body;
  if (name) partner.name = name.trim();
  if (url) partner.url = url.trim();

  if (req.file) {
    if (partner.image) {
      try {
        const oldFilePath = path.join(__dirname, '..', '..', partner.image);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      } catch (error) {
        console.error('Failed to delete old partner image from local storage:', error);
      }
    }
    try {
      partner.image = await processImage(req.file);
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  }

  await partner.save();
  res.status(200).json({ success: true, data: partner });
});

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin only)
exports.deletePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return next(new ErrorResponse(messages.notFound, 404));

  if (partner.image) {
    try {
      const filePath = path.join(__dirname, '..', '..', partner.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Failed to delete partner image from local storage:', error);
    }
  }

  await Partner.deleteOne({ _id: partner._id });
  res.status(200).json({ success: true, message: messages.deleted });
});
