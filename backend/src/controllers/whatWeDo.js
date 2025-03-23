const WhatWeDo = require('../models/WhatWeDo');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');

// @desc    Get what we do content
// @route   GET /api/what-we-do
// @access  Public
exports.getWhatWeDo = asyncHandler(async (req, res, next) => {
  const whatWeDo = await WhatWeDo.getInstance();

  res.status(200).json({
    success: true,
    data: whatWeDo,
  });
});

// @desc    Update what we do content
// @route   PUT /api/what-we-do
// @access  Private
exports.updateWhatWeDo = asyncHandler(async (req, res, next) => {
  let whatWeDo = await WhatWeDo.getInstance();

  if (!whatWeDo) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  whatWeDo = await WhatWeDo.findByIdAndUpdate(whatWeDo._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: { en: 'Updated successfully', ar: 'تم التحديث بنجاح' },
    data: whatWeDo,
  });
});
