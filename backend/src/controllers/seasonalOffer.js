const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const SeasonalOffer = require('../models/SeasonalOffer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirOffers = path.join(uploadsBaseDir, 'offers');

// Ensure offers directory exists
const ensureDirectory = () => {
  if (!fs.existsSync(imagesDestDirOffers)) {
    fs.mkdirSync(imagesDestDirOffers, { recursive: true });
  }
};

// Utility to validate and resize image
const processImage = async (file) => {
  const fileSizeInMB = file.size / (1024 * 1024);
  const destPath = path.join(imagesDestDirOffers, file.filename);

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

  return `/uploads/offers/${file.filename}`;
};

// @desc    Get all seasonal offers
// @route   GET /api/seasonal-offers
// @access  Public
exports.getSeasonalOffers = asyncHandler(async (req, res, next) => {
  const { show } = req.query;
  const query = {};
  if (show !== undefined) query.show = show === 'true';

  const offers = await SeasonalOffer.find(query);

  res.status(200).json({
    success: true,
    count: offers.length,
    data: offers,
  });
});

// @desc    Get single seasonal offer
// @route   GET /api/seasonal-offers/:id
// @access  Public
exports.getSeasonalOffer = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const offer = await SeasonalOffer.findById(req.params.id);
  if (!offer) {
    let { ar, en } = messages.offerNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  res.status(200).json({ success: true, data: offer });
});

// @desc    Create new seasonal offer
// @route   POST /api/seasonal-offers
// @access  Private
exports.createSeasonalOffer = asyncHandler(async (req, res, next) => {
  ensureDirectory();

  if (req.file) {
    try {
      req.body.image = await processImage(req.file);
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  }

  const { title_en, title_ar, details_en, details_ar } = req.body;
  const offerData = {
    title: { en: title_en, ar: title_ar },
    details: { en: details_en, ar: details_ar },
    image: req.body.image || null,
    show: req.body.show,
  };

  let offer;
  if (title_en) {
    offer = await SeasonalOffer.create(offerData);
  } else {
    offer = await SeasonalOffer.create(req.body);
  }

  res.status(201).json({ success: true, data: offer });
});

// @desc    Update seasonal offer
// @route   PUT /api/seasonal-offers/:id
// @access  Private
exports.updateSeasonalOffer = asyncHandler(async (req, res, next) => {
  ensureDirectory();

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  let offer = await SeasonalOffer.findById(req.params.id);
  if (!offer) {
    let { ar, en } = messages.offerNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  if (req.file) {
    if (offer.image) {
      try {
        const oldFilePath = path.join(__dirname, '..', '..', offer.image);
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

  offer = await SeasonalOffer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: offer });
});

// @desc    Delete seasonal offer
// @route   DELETE /api/seasonal-offers/:id
// @access  Private
exports.deleteSeasonalOffer = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let { ar, en } = messages.invalid_id;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 400));
  }

  const offer = await SeasonalOffer.findById(req.params.id);
  if (!offer) {
    let { ar, en } = messages.offerNotFound;
    ar = ar.replace('{id}', req.params.id);
    en = en.replace('{id}', req.params.id);
    return next(new ErrorResponse({ en, ar }, 404));
  }

  if (offer.image) {
    try {
      const filePath = path.join(__dirname, '..', '..', offer.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Failed to delete image from local storage:', error);
    }
  }

  await offer.deleteOne();
  res.status(200).json({ success: true, message: messages.offerDeleted, data: {} });
});
