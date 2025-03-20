const HomePageImages = require('../models/HomePageImages');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get home page images
// @route   GET /api/home-page-images
// @access  Public
exports.getHomePageImages = asyncHandler(async (req, res, next) => {
  const homePageImages = await HomePageImages.getInstance();

  res.status(200).json({
    success: true,
    data: homePageImages,
  });
});

// @desc    Update home page images
// @route   PUT /api/home-page-images
// @access  Private
exports.updateHomePageImages = asyncHandler(async (req, res, next) => {
  let homePageImages = await HomePageImages.getInstance();

  if (!homePageImages) {
    return next(new ErrorResponse(messages.contentNotFound, 404));
  }

  // Handle multiple file uploads (assuming multer is configured to handle multiple files)
  if (req.files) {
    const imageFields = ['whatWeDo', 'brands', 'news', 'showroom'];
    const updates = {};

    for (const field of imageFields) {
      if (req.files[field]) {
        // Delete old image from Cloudinary if it exists
        if (homePageImages[field]) {
          try {
            const publicId = homePageImages[field].split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`Alweam/home/${publicId}`);
            console.log(`Deleted old ${field} image from Cloudinary: ${publicId}`);
          } catch (error) {
            console.error(`Failed to delete ${field} image from Cloudinary:`, error);
          }
        }
        // Add new Cloudinary URL
        updates[field] = req.files[field][0].path;
      }
    }

    // Merge file updates with any other body updates
    req.body = { ...req.body, ...updates };
  }

  homePageImages = await HomePageImages.findByIdAndUpdate(homePageImages._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: messages.contentUpdated,
    data: homePageImages,
  });
});
