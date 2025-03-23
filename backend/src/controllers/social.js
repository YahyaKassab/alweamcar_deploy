const Social = require('../models/social');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');

// @desc    Get social media and contact info
// @route   GET /api/social
// @access  Public
exports.getSocial = asyncHandler(async (req, res, next) => {
  const social = await Social.getInstance();

  res.status(200).json({
    success: true,
    data: social,
  });
});

// @desc    Update social media and contact info
// @route   PUT /api/social
// @access  Private
exports.updateSocial = asyncHandler(async (req, res, next) => {
  let social = await Social.getInstance();

  if (!social) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  social = await Social.findByIdAndUpdate(social._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: {
      en: 'Social media and contact info updated successfully',
      ar: 'تم تحديث الوسائط الاجتماعية ومعلومات الاتصال بنجاح',
    },
    data: social,
  });
});
