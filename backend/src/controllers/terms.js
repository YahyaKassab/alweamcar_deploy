const Terms = require('../models/Terms');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');

// @desc    Get what we do content
// @route   GET /api/what-we-do
// @access  Public
exports.getTermsAndConditions = asyncHandler(async (req, res, next) => {
  const termsAndConditions = await Terms.getInstance();

  res.status(200).json({
    success: true,
    data: termsAndConditions,
  });
});

// @desc    Update what we do content
// @route   PUT /api/what-we-do
// @access  Private
exports.updateTermsAndConditions = asyncHandler(async (req, res, next) => {
  let termsAndConditions = await Terms.getInstance();

  if (!termsAndConditions) {
    return next(new ErrorResponse(messages.contentNotFound, 404));
  }

  termsAndConditions = await Terms.findByIdAndUpdate(termsAndConditions._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: messages.contentUpdated,
    data: termsAndConditions,
  });
});
