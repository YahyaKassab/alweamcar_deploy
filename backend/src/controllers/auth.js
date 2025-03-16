const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../locales/messages');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Utility to send emails
const { default: mongoose } = require('mongoose');

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
        return next(new ErrorResponse(messages.admin_not_found, 404));
    }

    // Get reset token
    const resetToken = admin.getResetPasswordToken();

    await admin.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    const getPasswordResetEmail = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #1e1e1e;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        h2 {
            color: #ffcc00;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            color: #121212;
            background-color: #ffcc00;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #aaaaaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>
            You are receiving this email because you (or someone else) has requested the reset of a password. <br>
            Please click the button below to reset your password:
        </p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p class="footer">
            If you did not request this, you can safely ignore this email.
        </p>
    </div>

    <div class="container">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>
            لقد تلقيت هذا البريد الإلكتروني لأنك (أو شخص آخر) طلب إعادة تعيين كلمة المرور. <br>
            يرجى الضغط على الزر أدناه لإعادة تعيين كلمة المرور:
        </p>
        <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
        <p class="footer">
            إذا لم تطلب ذلك، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
        </p>
    </div>
</body>
</html>
`;

    try {
        await sendEmail({
            email: admin.email,
            subject: messages.reset_password_subject,
            html: getPasswordResetEmail(resetUrl),
        });

        res.status(200).json({
            success: true,
            message: messages.email_sent,
        });
    } catch (error) {
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save({ validateBeforeSave: false });

        return next(new ErrorResponse(messages.email_failed, 500));
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const admin = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
        return next(new ErrorResponse(messages.invalid_reset_token, 400));
    }

    // Set new password
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    sendTokenResponse(admin, 200, res);
});

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, mobile } = req.body;

    // Create admin
    const admin = await Admin.create({
        name,
        email,
        password,
        mobile,
    });

    sendTokenResponse(admin, 201, res);
});

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse(messages.provide_email_password, 400));
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
        return next(new ErrorResponse(messages.invalid_credentials, 401));
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse(messages.invalid_credentials, 401));
    }

    sendTokenResponse(admin, 200, res);
});

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
        success: true,
        data: admin,
    });
});

// @desc    Log admin out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {},
    });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
    // Create token
    const token = admin.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).json({
        success: true,
        token,
    });
};
