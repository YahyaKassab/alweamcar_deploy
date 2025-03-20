const Partner = require('../models/Partner');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const messages = require('../locales/messages');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for partners
const storagePartners = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Alweam/partners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse(messages.invalidFileType, 400), false);
  }
};

// Multer upload configuration
exports.uploadPartners = multer({
  storage: storagePartners,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 }, // 5MB default
  fileFilter: fileFilter,
});

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private (Admin only)
exports.createPartner = asyncHandler(async (req, res, next) => {
  const { name, url } = req.body;

  if (!name || !url) {
    return next(new ErrorResponse(messages.requiredFieldsMissing, 400));
  }

  // Handle Cloudinary image upload
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path; // Cloudinary URL from multer
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
  const partners = await Partner.find().skip(skip).limit(parseInt(limit, 10)).sort('name'); // Sort by name (English)

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

  if (!partner) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  const { name, url } = req.body;

  // Update fields if provided
  if (name) partner.name = name.trim();
  if (url) partner.url = url.trim();

  // Handle Cloudinary image upload
  if (req.file) {
    // Delete old image from Cloudinary
    try {
      const oldPublicId = partner.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`Alweam/partners/${oldPublicId}`);
    } catch (error) {
      console.error('Failed to delete old partner image from Cloudinary:', error);
    }
    partner.image = req.file.path; // Update with new image URL
  }

  await partner.save();

  res.status(200).json({
    success: true,
    data: partner,
  });
});

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin only)
exports.deletePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  // Delete image from Cloudinary
  try {
    const publicId = partner.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`Alweam/partners/${publicId}`);
  } catch (error) {
    console.error('Failed to delete partner image from Cloudinary:', error);
  }

  await Partner.deleteOne({ _id: partner._id });

  res.status(200).json({
    success: true,
    message: messages.deleted,
  });
});
