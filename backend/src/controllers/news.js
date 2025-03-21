const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const News = require('../models/News');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirNews = path.join(uploadsBaseDir, 'news');

// Ensure news directory exists
const ensureDirectory = () => {
  if (!fs.existsSync(imagesDestDirNews)) {
    fs.mkdirSync(imagesDestDirNews, { recursive: true });
  }
};

// Utility to validate and resize image
const processImage = async (file) => {
  const fileSizeInMB = file.size / (1024 * 1024);
  const destPath = path.join(imagesDestDirNews, file.filename);

  if (fileSizeInMB > 1) {
    const resizedBuffer = await sharp(file.path)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const resizedSizeInMB = resizedBuffer.length / (1024 * 1024);
    if (resizedSizeInMB > 1) {
      throw new Error(
        `Image ${file.filename} could not be resized below 1MB (${resizedSizeInMB.toFixed(2)}MB)`
      );
    }

    fs.writeFileSync(destPath, resizedBuffer);
    fs.unlinkSync(file.path); // Remove temp file
  } else {
    fs.renameSync(file.path, destPath);
  }

  return `/uploads/news/${file.filename}`;
};

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
  ensureDirectory();

  if (req.file) {
    try {
      req.body.image = await processImage(req.file);
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  }

  const { title_en, title_ar, details_en, details_ar, brave_en, brave_ar } = req.body;

  const newsData = {
    content: [
      {
        title: { en: title_en, ar: title_ar },
        details: { en: details_en, ar: details_ar },
      },
    ],
    brave: { en: brave_en, ar: brave_ar },
    image: req.body.image || null,
  };

  const news = await News.create(newsData);
  res.status(201).json({ success: true, data: news });
});

// @desc    Update news item
// @route   PUT /api/news/:id
// @access  Private
exports.updateNews = asyncHandler(async (req, res, next) => {
  ensureDirectory();
  let news = await News.findById(req.params.id);
  if (!news) {
    let { ar, en } = messages.newsNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  if (req.file) {
    if (news.image) {
      try {
        const oldFilePath = path.join(__dirname, '..', '..', news.image);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      } catch (error) {
        console.error('Failed to delete image from local storage:', error);
      }
    }
    try {
      req.body.image = await processImage(req.file);
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  }

  const updateData = {};
  if (req.body.title_en || req.body.title_ar || req.body.details_en || req.body.details_ar) {
    updateData.content = [
      {
        title: {
          en: req.body.title_en || news.content[0].title.en,
          ar: req.body.title_ar || news.content[0].title.ar,
        },
        details: {
          en: req.body.details_en || news.content[0].details.en,
          ar: req.body.details_ar || news.content[0].details.ar,
        },
      },
    ];
  }
  if (req.body.brave_en || req.body.brave_ar) {
    updateData.brave = {
      en: req.body.brave_en || news.brave.en,
      ar: req.body.brave_ar || news.brave.ar,
    };
  }
  if (req.body.image) updateData.image = req.body.image;

  news = await News.findByIdAndUpdate(req.params.id, updateData, {
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

  if (news.image) {
    try {
      const filePath = path.join(__dirname, '..', '..', news.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Failed to delete image from local storage:', error);
    }
  }

  await news.deleteOne();
  res.status(200).json({ success: true, message: messages.newsDeleted });
});
