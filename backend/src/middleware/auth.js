const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');

// Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Extract token from header
        token = req.headers.authorization.split(' ')[1];
    }

    // Ensure token exists
    if (!token) {
        // console.log('lang ', req.language, 'm: ', unauthorized);
        return next(new ErrorResponse(messages.unauthorized, 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = await Admin.findById(decoded.id);

        if (!req.admin) {
            return next(new ErrorResponse(messages.invalid_token, 401));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse(messages.invalid_token, 401));
    }
});
