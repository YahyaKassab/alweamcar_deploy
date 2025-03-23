const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Car = require('./models/Car');
const SeasonalOffer = require('./models/SeasonalOffer');
const Feedback = require('./models/Feedback');
const News = require('./models/News');
const Make = require('./models/Make');
const FAQ = require('./models/FAQ');
const Partner = require('./models/Partner');

// Load environment variables at the top
require('dotenv').config();

// Set image source and destination directories
const imagesSourceDirCars = path.join(__dirname, 'data/images/cars');
const imagesSourceDirOffers = path.join(__dirname, 'data/images/offers');
const imagesSourceDirPartners = path.join(__dirname, 'data/images/cars');
const uploadsBaseDir = path.join(__dirname, '..', '..', 'uploads');
const imagesDestDirCars = path.join(uploadsBaseDir, 'cars');
const imagesDestDirOffers = path.join(uploadsBaseDir, 'offers');
const imagesDestDirNews = path.join(uploadsBaseDir, 'news');
const imagesDestDirPartners = path.join(uploadsBaseDir, 'partners');

// Ensure upload directories exist
const ensureDirectories = () => {
  [
    uploadsBaseDir,
    imagesDestDirCars,
    imagesDestDirOffers,
    imagesDestDirNews,
    imagesDestDirPartners,
  ].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Utility function to copy and resize image if necessary
const copyImageLocally = async (imageObj, destDir, folder) => {
  try {
    const { url } = imageObj;
    if (!url || typeof url !== 'string') {
      console.warn(`⚠️ Invalid image URL: ${JSON.stringify(imageObj)}`);
      return null;
    }

    // If the path is already in uploads, preserve it
    if (url.startsWith(`/uploads/${folder}/`)) {
      return imageObj; // Return the original object unchanged
    }

    const sourcePath = path.join(imagesSourceDirCars, url); // Use url as filename
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️ Image not found: ${sourcePath}`);
      return null;
    }

    const stats = fs.statSync(sourcePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    const filename = path.basename(sourcePath);
    const destPath = path.join(destDir, filename);

    if (fileSizeInMB > 1) {
      const resizedBuffer = await sharp(sourcePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const resizedSizeInMB = resizedBuffer.length / (1024 * 1024);
      if (resizedSizeInMB > 1) {
        console.warn(
          `⚠️ Image could not be resized below 1MB (${resizedSizeInMB.toFixed(2)}MB): ${sourcePath}`
        );
        return null;
      }

      fs.writeFileSync(destPath, resizedBuffer);
      console.log(`📸 Resized and copied locally: ${folder}/${filename}`);
    } else {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`📸 Copied locally: ${folder}/${filename}`);
    }

    return { url: `/uploads/${folder}/${filename}`, main: imageObj.main || false };
  } catch (error) {
    console.error(`❌ Local copy/resize failed for ${JSON.stringify(imageObj)}:`, error.message);
    return null;
  }
};

const seedData = async () => {
  try {
    ensureDirectories();

    console.log('🧹 Clearing old data...');

    // Delete existing records
    await Car.deleteMany();
    await SeasonalOffer.deleteMany();
    await Feedback.deleteMany();
    await News.deleteMany();
    await Make.deleteMany();
    await FAQ.deleteMany();
    await Partner.deleteMany();

    console.log('🌱 Seeding new data...');

    // Load data from JSON files
    const cars = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cars.json'), 'utf-8'));
    const offers = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'offers.json'), 'utf-8')
    );
    const feedbacks = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'feedbacks.json'), 'utf-8')
    );
    const news = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'news.json'), 'utf-8'));
    const makes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'makes.json'), 'utf-8'));
    const faqs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'FAQs.json'), 'utf-8'));
    const partners = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'partners.json'), 'utf-8')
    );
    const savedMakes = await Make.insertMany(makes);

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Process car images and assign random make/model
    for (const car of cars) {
      if (Array.isArray(car.images) && car.images.length > 0) {
        const processedImages = await Promise.all(
          car.images.map(async (image) => await copyImageLocally(image, imagesDestDirCars, 'cars'))
        );
        car.images = processedImages.filter(Boolean);
      } else {
        console.warn(`⚠️ No valid images array for car: ${car.stockNumber}`);
        car.images = [];
      }

      // Assign random make and model from savedMakes
      if (savedMakes.length > 0) {
        const randomMake = getRandomElement(savedMakes);
        car.make = randomMake._id;
        car.model = getRandomElement(randomMake.models);
      } else {
        console.warn(`⚠️ No makes available to assign to car: ${car.stockNumber}`);
        car.make = null;
        car.model = null;
      }
    }

    // Process news images
    for (const article of news) {
      if (article.image) {
        const sourcePath = path.join(imagesSourceDirCars, article.image); // Adjust if news has its own dir
        article.image = await copyImageLocally({ url: article.image }, imagesDestDirNews, 'news');
        if (article.image) article.image = article.image.url; // News expects a string
      } else {
        console.warn(`⚠️ No image specified for news article`);
        article.image = null;
      }
    }

    // Process offer images
    for (const offer of offers) {
      if (offer.image) {
        const sourcePath = path.join(imagesSourceDirOffers, offer.image);
        offer.image = await copyImageLocally({ url: offer.image }, imagesDestDirOffers, 'offers');
        if (offer.image) offer.image = offer.image.url; // Offers expects a string
      } else {
        console.warn(`⚠️ No image specified for offer`);
        offer.image = null;
      }
    }

    // Process partner images
    for (const partner of partners) {
      if (partner.image) {
        const sourcePath = path.join(imagesSourceDirPartners, partner.image);
        partner.image = await copyImageLocally(
          { url: partner.image },
          imagesDestDirPartners,
          'partners'
        );
        if (partner.image) partner.image = partner.image.url; // Partners expects a string
      } else {
        console.warn(`⚠️ No image specified for partner: ${partner.name}`);
        partner.image = null;
      }
    }

    // Insert data into the database
    const validOffers = offers.filter((offer) => offer.image);
    const validNews = news.filter((article) => article.image);
    const validPartners = partners.filter((partner) => partner.image);

    if (validOffers.length > 0) await SeasonalOffer.insertMany(validOffers);
    await Feedback.insertMany(feedbacks);
    if (validNews.length > 0) await News.insertMany(validNews);
    await Car.insertMany(cars);
    await FAQ.insertMany(faqs);
    if (validPartners.length > 0) await Partner.insertMany(validPartners);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
};

module.exports = { seedData };
