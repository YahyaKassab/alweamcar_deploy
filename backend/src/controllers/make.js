const messages = require('../locales/messages');
const Make = require('../models/Make');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new make
// @route   POST /api/makes
// @access  Private (Admin only)
exports.createMake = asyncHandler(async (req, res, next) => {
  const { name, models } = req.body;

  if (!name) {
    return next(new ErrorResponse(messages.makeRequired, 400));
  }

  const existingMake = await Make.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

  if (existingMake) {
    return next(new ErrorResponse(messages.duplicate_key, 400));
  }

  const make = await Make.create({ name, models: models || [] });

  res.status(201).json({
    success: true,
    data: make
  });
});

// @desc    Get all makes with pagination
// @route   GET /api/makes
// @access  Public
exports.getMakes = asyncHandler(async (req, res) => {

  const total = await Make.countDocuments();

  const makes = await Make.find({}, 'name models')
    .sort('name');

  res.status(200).json({
    success: true,
    count: makes.length,
    total,
    data: makes
  });
});

// @desc    Update a make
// @route   PUT /api/makes/:id
// @access  Private (Admin only)
exports.updateMake = asyncHandler(async (req, res, next) => {
  let make = await Make.findById(req.params.id);

  if (!make) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  const { name, models } = req.body;

  if (name) make.name = name;
  if (models) make.models = models;

  await make.save();

  res.status(200).json({
    success: true,
    data: make
  });
});

// @desc    Delete a make
// @route   DELETE /api/makes/:id
// @access  Private (Admin only)
exports.deleteMake = asyncHandler(async (req, res, next) => {
  const make = await Make.findById(req.params.id);

  if (!make) {
    return next(new ErrorResponse(`Make not found with id of ${req.params.id}`, 404));
  }

  await make.remove();

  res.status(200).json({
    success: true,
    message: 'Make deleted successfully'
  });
});
