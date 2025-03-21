const mongoose = require('mongoose');
const messages = require('../locales/messages');

const NewsSchema = new mongoose.Schema({
  content: [
    {
      title: {
        en: {
          type: String,
          required: [true, messages.titleRequired.en],
          trim: true,
        },
        ar: {
          type: String,
          required: [true, messages.titleRequired.ar],
          trim: true,
        },
      },

      details: {
        en: {
          type: String,
          required: [true, messages.detailsRequired.en],
        },
        ar: {
          type: String,
          required: [true, messages.detailsRequired.ar],
        },
      },
    },
  ],
  brave: {
    en: {
      type: String,
      required: [true, messages.required.en],
    },
    ar: {
      type: String,
      required: [true, messages.required.ar],
    },
  },
  image: {
    type: String,
    // required: [true, messages.imagesRequired.en],
  },

  date: {
    type: Date,
    default: Date.now,
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
NewsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('News', NewsSchema);
