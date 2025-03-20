// models/make.model.js
const mongoose = require('mongoose');
const messages = require('../locales/messages');

const MakeSchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, messages.required.en],
      trim: true,
      unique: true,
    },
    ar: {
      type: String,
      required: [true, messages.required.ar],
      trim: true,
      unique: true,
    },
  },
  models: [
    {
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
  ],
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
MakeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Make', MakeSchema);
