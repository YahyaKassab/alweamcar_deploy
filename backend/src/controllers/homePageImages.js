const fs = require('fs'); // Use promises for async file operations
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
    return next(new ErrorResponse(messages.notFound, 404));
  }

  // Handle file uploads processed by multer and sharp
  if (req.files) {
    const imageFields = ['whatWeDo', 'brands', 'news', 'showroom'];
    const updates = {};

    for (const field of imageFields) {
      if (req.files[field]) {
        // Delete old image from local storage if it exists
        if (homePageImages[field]) {
          try {
            const oldFilePath = path.join(__dirname, '..', '..', '..', homePageImages[field]);
            if (fs.existsSync(oldFilePath)) {
              await fs.promises.unlink(oldFilePath);
              console.log(`Deleted old ${field} image: ${homePageImages[field]}`);
            }
          } catch (error) {
            console.error(`Failed to delete ${field} image:`, error);
          }
        }
        // Use the processed file path from multer/sharp
        updates[field] = `/uploads/home/${req.files[field][0].filename}`;
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
    message: { en: 'Updated', ar: 'تم التحديث' },
    data: homePageImages,
  });
});
