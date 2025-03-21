const mongoose = require('mongoose');

const HomePageImagesSchema = new mongoose.Schema({
  whatWeDo: {
    type: String,
  },
  brands: {
    type: String,
  },
  news: {
    type: String,
  },
  showroom: {
    type: String,
  },
  feedback: {
    type: String,
  },

  terms: {
    type: String,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Singleton pattern to ensure only one document exists
HomePageImagesSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    instance = await this.create({
      whatWeDo: 'whatwedo.jpg',
      brands: 'brands.jpg',
      news: 'news.jpg',
      showroom: 'showroom.jpg',
      feedback: 'feedback.jpg',
      terms: 'terms.jpg',
    });
  }
  return instance;
};

module.exports = mongoose.model('HomePageImages', HomePageImagesSchema);
