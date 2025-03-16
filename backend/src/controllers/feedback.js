const Feedback = require('../models/Feedback');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');

// @desc    Get all feedbacks
// @route   GET /api/feedback
// @access  Private
exports.getFeedbacks = asyncHandler(async (req, res, next) => {
    const feedbacks = await Feedback.find().sort('-createdAt');

    res.status(200).json({
        success: true,
        count: feedbacks.length,
        data: feedbacks,
    });
});

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedback = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let { ar, en } = messages.invalid_id;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 400));
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        let { ar, en } = messages.notFound;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 404));
    }

    res.status(200).json({
        success: true,
        data: feedback,
    });
});

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = asyncHandler(async (req, res, next) => {
    const feedback = await Feedback.create(req.body);

    res.status(201).json({
        success: true,
        data: feedback,
    });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = asyncHandler(async (req, res, next) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        let { ar, en } = messages.notFound;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 404));
    }

    await feedback.deleteOne();

    res.status(200).json({
        success: true,
        message: messages.deleted,
    });
});
