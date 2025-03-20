// models/FAQ.js
const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    en: {
      type: String,
      required: [true, 'English question is required'],
    },
    ar: {
      type: String,
      required: [true, 'السؤال العربي مطلوب'],
    },
  },
  answer: {
    en: {
      type: String,
      required: [true, 'English answer is required'],
    },
    ar: {
      type: String,
      required: [true, 'الإجابة العربية مطلوبة'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FAQ', FAQSchema);
