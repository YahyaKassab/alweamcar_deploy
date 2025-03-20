const messages = require('../locales/messages');
const Make = require('../models/Make');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new make
// @route   POST /api/makes
// @access  Private (Admin only)
exports.createMake = asyncHandler(async (req, res, next) => {
  const { name, models } = req.body;

  // Validate name object
  if (!name || !name.en || !name.ar) {
    return next(new ErrorResponse(messages.makeRequired, 400));
  }

  // Check for existing make using English name
  const existingMake = await Make.findOne({
    'name.en': { $regex: new RegExp(`^${name.en.trim()}$`, 'i') },
  });

  if (existingMake) {
    return next(new ErrorResponse(messages.duplicate_key, 400));
  }

  // Ensure models is an array of objects with en and ar fields (if provided)
  const formattedModels = models
    ? models.map((model) => ({
        en: model.en ? model.en.trim() : '',
        ar: model.ar ? model.ar.trim() : '',
      }))
    : [];

  const make = await Make.create({
    name: {
      en: name.en.trim(),
      ar: name.ar.trim(),
    },
    models: formattedModels,
  });

  res.status(201).json({
    success: true,
    data: make,
  });
});

// @desc    Get all makes with pagination
// @route   GET /api/makes
// @access  Public
exports.getMakes = asyncHandler(async (req, res) => {
  const total = await Make.countDocuments();
  const makes = await Make.find({}, 'name models').sort('name.en'); // Sort by English name

  res.status(200).json({
    success: true,
    count: makes.length,
    total,
    data: makes,
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

  // Update name if provided
  if (name) {
    if (!name.en || !name.ar) {
      return next(new ErrorResponse(messages.makeRequired, 400));
    }
    // Check for duplicate English name (excluding current make)
    const existingMake = await Make.findOne({
      'name.en': { $regex: new RegExp(`^${name.en.trim()}$`, 'i') },
      _id: { $ne: make._id },
    });
    if (existingMake) {
      return next(new ErrorResponse(messages.duplicate_key, 400));
    }
    make.name = { en: name.en.trim(), ar: name.ar.trim() };
  }

  // Update models if provided
  if (models) {
    make.models = models.map((model) => ({
      en: model.en ? model.en.trim() : '',
      ar: model.ar ? model.ar.trim() : '',
    }));
  }

  await make.save();

  res.status(200).json({
    success: true,
    data: make,
  });
});

// @desc    Delete a make
// @route   DELETE /api/makes/:id
// @access  Private (Admin only)
exports.deleteMake = asyncHandler(async (req, res, next) => {
  const make = await Make.findById(req.params.id);

  if (!make) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  await Make.deleteOne({ _id: make._id });

  res.status(200).json({
    success: true,
    message: messages.deleted,
  });
});
