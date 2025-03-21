const fs = require('fs');
const path = require('path');
const HomePageImages = require('../models/HomePageImages');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirHome = path.join(uploadsBaseDir, 'home');

// Ensure home directory exists
const ensureDirectory = () => {
  if (!fs.existsSync(imagesDestDirHome)) {
    fs.mkdirSync(imagesDestDirHome, { recursive: true });
  }
};

// Utility to validate and move image
const processImage = (file) => {
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > 5) {
    throw new ErrorResponse(
      {
        en: `Image ${file.filename} exceeds 5MB limit (${fileSizeInMB.toFixed(2)}MB)`,
        ar: `الصورة ${file.filename} تتجاوز الحد الأقصى 5MB (${fileSizeInMB.toFixed(2)}MB)`,
      },
      400
    );
  }

  const destPath = path.join(imagesDestDirHome, file.filename);
  fs.renameSync(file.path, destPath); // Move file to uploads/home
  return `/uploads/home/${file.filename}`; // Return relative path
};

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
  ensureDirectory();
  let homePageImages = await HomePageImages.getInstance();

  if (!homePageImages) {
    return next(new ErrorResponse(messages.contentNotFound, 404));
  }

  // Handle multiple file uploads
  if (req.files) {
    const imageFields = ['whatWeDo', 'brands', 'news', 'showroom'];
    const updates = {};

    for (const field of imageFields) {
      if (req.files[field]) {
        // Delete old image from local storage if it exists
        if (homePageImages[field]) {
          try {
            const oldFilePath = path.join(__dirname, '..', '..', homePageImages[field]);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
              console.log(
                `Deleted old ${field} image from local storage: ${homePageImages[field]}`
              );
            }
          } catch (error) {
            console.error(`Failed to delete ${field} image from local storage:`, error);
          }
        }
        // Process and move new image
        try {
          updates[field] = processImage(req.files[field][0]);
        } catch (error) {
          return next(new ErrorResponse(error.message, 400));
        }
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
