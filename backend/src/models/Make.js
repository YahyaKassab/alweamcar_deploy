// models/make.model.js
const mongoose = require('mongoose');
const messages = require('../locales/messages');

const MakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Make name is required'],
        trim: true,
        unique: true
    },
    models: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
MakeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Make', MakeSchema);