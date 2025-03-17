const SeasonalOffer = require('../models/SeasonalOffer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;

// @desc    Get all seasonal offers
// @route   GET /api/seasonal-offers
// @access  Public
exports.getSeasonalOffers = asyncHandler(async (req, res, next) => {
    const { show } = req.query;
    const query = {};
    if (show !== undefined) {
        query.show = show === 'true';
    }

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

    res.status(200).json({
        success: true,
        data: offer,
    });
});

// @desc    Create new seasonal offer
// @route   POST /api/seasonal-offers
// @access  Private
exports.createSeasonalOffer = asyncHandler(async (req, res, next) => {
    // Store only the URL from Cloudinary
    if (req.file) {
        req.body.image = req.file.path; // Cloudinary URL
    }

    const { title_en, title_ar, details_en, details_ar } = req.body;
    const offerData = {
        title: { en: title_en, ar: title_ar },
        details: { en: details_en, ar: details_ar },
        image: req.body.image || null,
        show: req.body.show
    };
    
    let offer;
    if (title_en) {
        offer = await SeasonalOffer.create(offerData);
    } else {
        offer = await SeasonalOffer.create(req.body);
    }

    res.status(201).json({
        success: true,
        data: offer,
    });
});

// @desc    Update seasonal offer
// @route   PUT /api/seasonal-offers/:id
// @access  Private
exports.updateSeasonalOffer = asyncHandler(async (req, res, next) => {
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

    // Handle image update with Cloudinary
    if (req.file) {
        // Extract public_id from existing URL if it exists and delete old image
        if (offer.image) {
            const publicId = offer.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`Alweam/offers/${publicId}`);
        }
        
        // Store new image URL
        req.body.image = req.file.path;
    }

    offer = await SeasonalOffer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: offer,
    });
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

    // Delete image from Cloudinary if it exists
    if (offer.image) {
        const publicId = offer.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`Alweam/offers/${publicId}`);
    }

    await offer.deleteOne();

    res.status(200).json({
        success: true,
        message: messages.offerDeleted,
        data: {},
    });
});