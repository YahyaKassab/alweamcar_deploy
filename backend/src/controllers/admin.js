const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const { default: mongoose } = require('mongoose');

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private

exports.getAdmins = asyncHandler(async (req, res, next) => {
    // if (!req.user || req.user.role !== 'admin') {
    //     return next(new ErrorResponse(unauthorized, 401));
    // }

    const admins = await Admin.find();

    res.status(200).json({
        success: true,
        count: admins.length,
        data: admins,
    });
});

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private
exports.getAdmin = asyncHandler(async (req, res, next) => {
    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let { ar, en } = messages.invalid_id;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 400));
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        let { ar, en } = messages.admin_not_found;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 404));
    }
    res.status(200).json({
        success: true,
        data: admin,
    });

    // if (!admin) {
    // }
});

// @desc    Create new admin
// @route   POST /api/admins
// @access  Private
exports.createAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        data: admin,
    });
});

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let { ar, en } = messages.invalid_id;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 400));
    }

    let admin = await Admin.findById(req.params.id);

    if (!admin) {
        let { ar, en } = messages.admin_not_found;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 404));
    }

    // Prevent password update through this route
    if (req.body.password) {
        delete req.body.password;
    }

    admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: admin,
    });
});

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        let { ar, en } = messages.admin_not_found;
        ar = ar.replace('{id}', req.params.id);
        en = en.replace('{id}', req.params.id);
        return next(new ErrorResponse({ en, ar }, 404));
    }

    await admin.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});
