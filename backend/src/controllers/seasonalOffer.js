const SeasonalOffer = require('../models/SeasonalOffer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
const fs = require('fs');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');

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
    if (req.file) {
        req.body.image = `/uploads/images/offers/${req.file.filename}`;
    }

    const offer = await SeasonalOffer.create(req.body);

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

    if (req.file) {
        const oldImagePath = path.join(__dirname, '../../public', offer.image);
        if (fs.existsSync(oldImagePath)) {
            fs.promises.unlink(oldImagePath);
        }

        req.body.image = `/uploads/images/offers/${req.file.filename}`;
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

    const imagePath = path.join(__dirname, '../../public', offer.image[0]);
    if (fs.existsSync(imagePath)) {
        fs.promises.unlink(imagePath);
    }

    await offer.deleteOne();

    res.status(200).json({
        success: true,
        message: messages.offerDeleted,
        data: {},
    });
});
