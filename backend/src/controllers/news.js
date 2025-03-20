const News = require('../models/News');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all news with pagination
// @route   GET /api/news
// @access  Public
exports.getAllNews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = Math.max(parseInt(limit, 10), 1);
  const skip = (page - 1) * parsedLimit;

  const total = await News.countDocuments();
  const news = await News.find().skip(skip).limit(parsedLimit).sort('-date');

  res.status(200).json({
    success: true,
    count: news.length,
    total,
    pagination: {
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / parsedLimit),
      pageSize: parsedLimit,
    },
    data: news,
  });
});

// @desc    Get single news item
// @route   GET /api/news/:id
// @access  Public
exports.getNews = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const news = await News.findById(req.params.id);
  if (!news) {
    let { ar, en } = messages.newsNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }
  res.status(200).json({ success: true, data: news });
});

// @desc    Create new news item
// @route   POST /api/news
// @access  Private
exports.createNews = asyncHandler(async (req, res, next) => {
  if (req.file) {
    // Cloudinary now handles the file, and multer-storage-cloudinary adds the URL to req.file
    req.body.image = req.file.path;
  }

  const { title_en, title_ar, details_en, details_ar } = req.body;
  const newsData = {
    title: { en: title_en, ar: title_ar },
    details: { en: details_en, ar: details_ar },
    image: req.body.image ? req.body.image : null, // Use Cloudinary URL
  };

  let news;
  if (title_en) {
    news = await News.create(newsData);
  } else {
    news = await News.create(req.body);
  }

  res.status(201).json({ success: true, data: news });
});

// @desc    Update news item
// @route   PUT /api/news/:id
// @access  Private
exports.updateNews = asyncHandler(async (req, res, next) => {
  let news = await News.findById(req.params.id);
  if (!news) {
    let { ar, en } = messages.newsNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  if (req.file) {
    // If there's an existing image, delete it from Cloudinary
    if (news.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const publicId = news.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`Alweam/news/${publicId}`);
        console.log(`Deleted old image from Cloudinary: ${publicId}`);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // Update with new Cloudinary URL
    req.body.image = req.file.path;
  }

  news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: news });
});

// @desc    Delete news item
// @route   DELETE /api/news/:id
// @access  Private
exports.deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    let { ar, en } = messages.newsNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  // Delete the image from Cloudinary if it exists
  if (news.image) {
    try {
      // Extract public_id from the Cloudinary URL
      const publicId = news.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`Alweam/news/${publicId}`);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }

  await news.deleteOne();
  res.status(200).json({ success: true, message: messages.newsDeleted });
});
