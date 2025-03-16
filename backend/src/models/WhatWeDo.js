const mongoose = require('mongoose');
const messages = require('../locales/messages');

const WhatWeDoSchema = new mongoose.Schema({
    content: {
        en: {
            type: String,
            required: [true, messages.contentRequired.en],
        },
        ar: {
            type: String,
            required: [true, messages.contentRequired.en],
        },
    },
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
            content: {
                en: 'Default what we do content',
                ar: 'محتوى افتراضي لما نقوم به',
            },
        });
    }
    return instance;
};

module.exports = mongoose.model('WhatWeDo', WhatWeDoSchema);
