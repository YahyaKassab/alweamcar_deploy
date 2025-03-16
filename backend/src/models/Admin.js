const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const messages = require('../locales/messages');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, messages.nameRequired.en],
        trim: true,
    },
    mobile: {
        type: String,
        required: [true, messages.mobileRequired.en],
        trim: true,
    },
    email: {
        type: String,
        required: [true, messages.emailRequired.en],
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, messages.invalidEmail.en],
    },
    password: {
        type: String,
        required: [true, messages.passwordRequired.en],
        minlength: 6,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
AdminSchema.methods.getResetPasswordToken = function (lang = 'en') {
    try {
        // Generate a secure random token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Ensure resetToken is valid
        if (!resetToken) {
            throw new ErrorResponse({
                ar: 'فشل في إنشاء رمز إعادة تعيين كلمة المرور.',
                en: 'Failed to generate password reset token.',
            });
        }

        // Hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token expiration time (10 min)
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        return resetToken;
    } catch (error) {
        console.error('Error generating reset token:', error);

        // Return error message based on language preference
        return {
            success: false,
            message: {
                ar: 'فشل في إنشاء رمز إعادة تعيين كلمة المرور.',
                en: 'Failed to generate password reset token.',
            },
        };
    }
};
// Encrypt password using bcrypt
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.updatedAt = Date.now();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Sign JWT and return
AdminSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Match user entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
