const mongoose = require('mongoose');
const messages = require('../locales/messages');

const FeedbackSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, messages.nameRequired.en],
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: [true, messages.mobileRequired.en],
        trim: true,
    },
    email: {
        type: String,
        required: [true, messages.emailRequired.en],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, messages.invalidEmail.en],
    },
    message: {
        type: String,
        required: [true, messages.messageRequired.en],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
