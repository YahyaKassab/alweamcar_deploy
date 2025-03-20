const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  mobile: {
    type: String,
    default: null,
  },
  insta: {
    type: String,
    default: null,
  },
  tiktok: {
    type: String,
    default: null,
  },
  youtube: {
    type: String,
    default: null,
  },
  snapchat: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  locationLink: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  whatsapp: {
    type: String,
    default: null,
  },
  salesNumbers: [
    {
      type: String,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Singleton pattern with default values
SocialSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    instance = await this.create({
      mobile: '065343353', // Assuming this is the showroom number as mobile
      insta: 'https://www.instagram.com/alweamcars?igsh=MXY1djk0ZmM0ZHZpYg%3D%3D&utm_source=qr',
      tiktok: 'https://www.tiktok.com/@alweamcars?is_from_webapp=1&sender_device=pc',
      youtube: 'ALWEAMCARS - YouTube', // You might want to replace with actual URL if available
      snapchat:
        'https://www.snapchat.com/add/alweamcars?sender_web_id=b2859193-8896-46a2-a177-3d146e0729e0&device_type=desktop&is_copy_url=true',
      location: 'SHARJAH – RED PLOT- LAND313/A-ALWEAM CENTER-SHOWROOM NO 4',
      locationLink: 'https://maps.app.goo.gl/G5FEZoaa9pFBVvNy8',
      email: null, // Not provided in your defaults
      whatsapp: null, // Not provided in your defaults
      salesNumbers: ['0508538666', '0555584722', '0508295755', '0509275502', '0506988047'],
    });
  }
  return instance;
};
module.exports = mongoose.model('Social', SocialSchema);
