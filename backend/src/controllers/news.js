const fs = require('fs'); // Use promises for async file operations
const path = require('path');
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

// @desc    Get all news with pagination
// @route   GET /api/news
// @access  Public
exports.getAllNews = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const parsedLimit = Math.max(parseInt(limit, 10), 1);
  const skip = (page - 1) * parsedLimit;

  const total = await News.countDocuments();
  const news = await News.find()
    .select('-content -__v')
    .skip(skip)
    .limit(parsedLimit)
    .sort('-date');

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
    req.body.image = `/uploads/news/${req.file.filename}`; // Set image URL from multer/sharp
  }

  const { title_en, title_ar, details_en, details_ar, preview_en, preview_ar } = req.body;

  const newsData = {
    content: [
      {
        title: { en: title_en, ar: title_ar },
        details: { en: details_en, ar: details_ar },
      },
    ],
    preview: { en: preview_en, ar: preview_ar },
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
        const oldFilePath = path.join(__dirname, '..', '..', '..', news.image);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
          console.log(`Deleted old image: ${news.image}`);
        }
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }
    req.body.image = `/uploads/news/${req.file.filename}`; // Set new image URL from multer/sharp
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
  if (req.body.preview_en || req.body.preview_ar) {
    updateData.preview = {
      en: req.body.preview_en || news.preview.en,
      ar: req.body.preview_ar || news.preview.ar,
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
      const filePath = path.join(__dirname, '..', '..', '..', news.image);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted image: ${news.image}`);
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }

  await news.deleteOne();
  res.status(200).json({ success: true, message: messages.newsDeleted });
});
