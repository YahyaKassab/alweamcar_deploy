const mongoose = require('mongoose');
const messages = require('../locales/messages');

const WhatWeDoSchema = new mongoose.Schema({
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
WhatWeDoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure there's only one instance
WhatWeDoSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    instance = await this.create({
      content: [
        {
          title: {
            en: 'Default Title in English',
            ar: 'العنوان الافتراضي بالعربية',
          },
          details: {
            en: 'Default details in English.',
            ar: 'تفاصيل افتراضية بالعربية.',
          },
        },
      ],
    });
  }
  return instance;
};

module.exports = mongoose.model('WhatWeDo', WhatWeDoSchema);
