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
  whatWeDo: {
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
      whatWeDo:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476123/Alweam/home/about_wmh7jw.webp',
      brands:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476123/Alweam/home/brands_cyxkhn.webp',
      news: 'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476124/Alweam/home/news_ibiwkx.webp',
      showroom:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476124/Alweam/home/contact_tkammi.jpg',
      feedback:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476124/Alweam/home/contact_tkammi.jpg',
      whatWeDo:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476124/Alweam/home/contact_tkammi.jpg',
      terms:
        'https://res.cloudinary.com/di7sxwjyd/image/upload/v1742476124/Alweam/home/contact_tkammi.jpg',
    });
  }
  return instance;
};

module.exports = mongoose.model('HomePageImages', HomePageImagesSchema);
