const mongoose = require('mongoose');
const messages = require('../locales/messages');

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, messages.nameRequired?.en || 'Partner name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Partner URL is required'],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Partner', PartnerSchema);
