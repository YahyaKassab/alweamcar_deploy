const News = require('../models/News');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
const fs = require('fs');
const messages = require('../locales/messages'); // Import localization messages
const { default: mongoose } = require('mongoose');

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
        req.body.image = `/uploads/images/news/${req.file.filename}`;
    }
    const { title_en, title_ar, details_en, details_ar } = req.body;
    const newsData = {
        title: { en: title_en, ar: title_ar },
        details: { en: details_en, ar: details_ar },
        image: req.body.image ? req.body.image : null, // Ensure image handling
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
        const oldImagePath = path.join(__dirname, '../../public', news.image);
        if (fs.existsSync(oldImagePath)) {
            fs.promises.unlink(oldImagePath);
        }
        req.body.image = `/uploads/images/news/${req.file.filename}`;
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
    const imagePath = path.join(__dirname, '../../public', news.image);
    if (fs.existsSync(imagePath)) {
        fs.promises.unlink(imagePath);
    }
    await news.deleteOne();
    res.status(200).json({ success: true, message: messages.newsDeleted });
});
