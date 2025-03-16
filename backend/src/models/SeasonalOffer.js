const mongoose = require('mongoose');
const messages = require('../locales/messages');

const SeasonalOfferSchema = new mongoose.Schema({
    image: {
        type: String,
        // required: [true, messages.imageRequired.en],
    },
    title: {
    en:{
        type: String,
        required: [true, messages.titleRequired.en],
        trim: true,
    },
    ar:{
        type: String,
        required: [true, messages.titleRequired.ar],
        trim: true,
    }}
    ,
    details: {
    en:{
        type: String,
        required: [true, messages.detailsRequired.en],
        trim: true,
    },
    ar:{
        type: String,
        required: [true, messages.detailsRequired.ar],
        trim: true,
    }},
    show: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
SeasonalOfferSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SeasonalOffer', SeasonalOfferSchema);
