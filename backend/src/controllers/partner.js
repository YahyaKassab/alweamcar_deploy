const fs = require('fs'); // Use promises for async file operations
const path = require('path');
const Partner = require('../models/Partner');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const messages = require('../locales/messages');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirPartners = path.join(uploadsBaseDir, 'partners');

// Ensure partners directory exists
const ensureDirectory = () => {
  if (!fs.existsSync(imagesDestDirPartners)) {
    fs.mkdirSync(imagesDestDirPartners, { recursive: true });
    console.log(`Created directory: ${imagesDestDirPartners}`);
  }
};

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Private (Admin only)
exports.createPartner = asyncHandler(async (req, res, next) => {
  ensureDirectory();
  const { name, url } = req.body;

  if (!name || !url) {
    return next(new ErrorResponse(messages.required, 400));
  }

  if (!req.file) {
    return next(new ErrorResponse(messages.imageRequired, 400));
  }

  const partner = await Partner.create({
    name: name.trim(),
    url: url.trim(),
    image: `/uploads/partners/${req.file.filename}`, // Set image URL from multer/sharp
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
  ensureDirectory();
  let partner = await Partner.findById(req.params.id);
  if (!partner) return next(new ErrorResponse(messages.notFound, 404));

  const { name, url } = req.body;
  if (name) partner.name = name.trim();
  if (url) partner.url = url.trim();

  if (req.file) {
    if (partner.image) {
      try {
        const oldFilePath = path.join(__dirname, '..', '..', '..', partner.image);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
          console.log(`Deleted old image: ${partner.image}`);
        }
      } catch (error) {
        console.error('Failed to delete old partner image:', error);
      }
    }
    partner.image = `/uploads/partners/${req.file.filename}`; // Set new image URL from multer/sharp
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
      const filePath = path.join(__dirname, '..', '..', '..', partner.image);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted image: ${partner.image}`);
      }
    } catch (error) {
      console.error('Failed to delete partner image:', error);
    }
  }

  await Partner.deleteOne({ _id: partner._id });
  res.status(200).json({ success: true, message: messages.deleted });
});
