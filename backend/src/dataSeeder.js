const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Car = require("./models/Car");
const SeasonalOffer = require("./models/SeasonalOffer");
const Feedback = require("./models/Feedback");
const News = require("./models/News");
const Make = require("./models/Make");

// Load environment variables at the top
require('dotenv').config();

// Configure Cloudinary with verification
const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

// Set image directories
const imagesSourceDirCars = path.join(__dirname, "data/images/cars");
const imagesSourceDirOffers = path.join(__dirname, "data/images/offers");

const seedData = async () => {
  try {
    // Configure Cloudinary before any operations
    configureCloudinary();

    console.log("🧹 Clearing old data...");

    // Delete existing records
    await Car.deleteMany();
    await SeasonalOffer.deleteMany();
    await Feedback.deleteMany();
    await News.deleteMany();
    await Make.deleteMany();

    console.log("🌱 Seeding new data...");

    // Load data from JSON files
    const cars = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "cars.json"), "utf-8"));
    const offers = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "offers.json"), "utf-8"));
    const feedbacks = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "feedbacks.json"), "utf-8"));
    const news = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "news.json"), "utf-8"));
    const makes = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "makes.json"), "utf-8"));
    const savedMakes = await Make.insertMany(makes);

    // Utility function for uploading images to Cloudinary
    const uploadToCloudinary = async (sourcePath, folder) => {
      try {
        if (!fs.existsSync(sourcePath)) {
          console.warn(`⚠️ Image not found: ${sourcePath}`);
          return null;
        }

        const result = await cloudinary.uploader.upload(sourcePath, {
          folder: `Alweam/${folder}`,
          use_filename: true,
          unique_filename: true
        });
        
        console.log(`📸 Uploaded to Cloudinary: ${folder} ${path.basename(sourcePath)}`);
        return result.secure_url;
      } catch (error) {
        console.error(`❌ Cloudinary upload failed for ${sourcePath}:`, error.message);
        return null;
      }
    };

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Process car images and upload to Cloudinary
    for (const car of cars) {
      if (Array.isArray(car.images) && car.images.length > 0) {
        const uploadPromises = car.images.map(async (image) => {
          const sourcePath = path.join(imagesSourceDirCars, image);
          return await uploadToCloudinary(sourcePath, 'cars');
        });
        
        car.images = (await Promise.all(uploadPromises)).filter(Boolean);
      } else {
        console.warn(`⚠️ No valid images array for car: ${car.stockNumber}`);
        car.images = [];
      }

      // Assign a random make and model
      if (savedMakes.length > 0) {
        const randomMake = getRandomElement(savedMakes);
        car.make = randomMake._id;
        car.model = getRandomElement(randomMake.models);
      } else {
        console.warn(`⚠️ No makes available to assign to car: ${car.stockNumber}`);
      }
    }

    // Process news images
    for (const article of news) {
      if (article.image) {
        const sourcePath = path.join(imagesSourceDirCars, article.image);
        article.image = await uploadToCloudinary(sourcePath, 'news');
      } else {
        console.warn(`⚠️ No image specified for news article`);
        article.image = null;
      }
    }

    // Process offer images
    for (const offer of offers) {
      if (offer.image) {
        const sourcePath = path.join(imagesSourceDirOffers, offer.image);
        offer.image = await uploadToCloudinary(sourcePath, 'offers');
      } else {
        console.warn(`⚠️ No image specified for offer`);
        offer.image = null;
      }
    }

    // Insert data into the database
    const validOffers = offers.filter(offer => offer.image);
    const validNews = news.filter(article => article.image);
    
    if (validOffers.length > 0) await SeasonalOffer.insertMany(validOffers);
    await Feedback.insertMany(feedbacks);
    if (validNews.length > 0) await News.insertMany(validNews);
    await Car.insertMany(cars);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    throw error; // Re-throw to handle in caller if needed
  }
};

module.exports = { seedData };