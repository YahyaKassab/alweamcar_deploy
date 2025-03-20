// controllers/faq.js
const FAQ = require('../models/FAQ');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const mongoose = require('mongoose');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = asyncHandler(async (req, res, next) => {
  const faqs = await FAQ.find().sort('createdAt');

  res.status(200).json({
    success: true,
    count: faqs.length,
    data: faqs,
  });
});

// @desc    Get single FAQ by ID
// @route   GET /api/faqs/:id
// @access  Public
exports.getFAQ = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    let { ar, en } = messages.contentNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  res.status(200).json({
    success: true,
    data: faq,
  });
});

// @desc    Create a new FAQ
// @route   POST /api/faqs
// @access  Private
exports.createFAQ = asyncHandler(async (req, res, next) => {
  const faq = await FAQ.create(req.body);

  res.status(201).json({
    success: true,
    data: faq,
  });
});

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private
exports.updateFAQ = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!faq) {
    let { ar, en } = messages.contentNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  res.status(200).json({
    success: true,
    data: faq,
  });
});

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private
exports.deleteFAQ = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    let { ar, en } = messages.contentNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  await FAQ.deleteOne(faq);

  res.status(200).json({
    success: true,
    message: messages.contentDeleted,
  });
});
