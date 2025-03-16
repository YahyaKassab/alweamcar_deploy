const fs = require("fs");
const path = require("path");
const Car = require("./models/Car");
const SeasonalOffer = require("./models/SeasonalOffer");
const Feedback = require("./models/Feedback");
const News = require("./models/News");
const Make = require("./models/Make");

const uploadsDirCars = path.join(__dirname, "../public/uploads/images/cars");
const uploadsDirOffers = path.join(__dirname, "../public/uploads/images/offers");
const uploadsDirNews = path.join(__dirname, "../public/uploads/images/news");

const imagesSourceDirCars = path.join(__dirname, "data/images/cars");
const imagesSourceDirOffers = path.join(__dirname, "data/images/offers");

const seedData = async () => {
  try {
    console.log("🧹 Clearing old data...");
    console.log("uploads dir:", uploadsDirCars);
    console.log("source dir:", imagesSourceDirCars);

    // Delete all car images
    if (fs.existsSync(uploadsDirCars)) {
      fs.readdirSync(uploadsDirCars).forEach((file) => {
        fs.unlinkSync(path.join(uploadsDirCars, file));
      });
      console.log("🗑️ Deleted all car images.");
    }

    // Delete all offer images
    if (fs.existsSync(uploadsDirOffers)) {
      fs.readdirSync(uploadsDirOffers).forEach((file) => {
        fs.unlinkSync(path.join(uploadsDirOffers, file));
      });
      console.log("🗑️ Deleted all offer images.");
    }

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

    // Ensure upload directories exist
    if (!fs.existsSync(uploadsDirCars)) fs.mkdirSync(uploadsDirCars, { recursive: true });
    if (!fs.existsSync(uploadsDirOffers)) fs.mkdirSync(uploadsDirOffers, { recursive: true });

    // Copy car images and update paths
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    cars.forEach((car) => {
        if (Array.isArray(car.images)) {
            car.images = car.images.map((image) => {
                const sourcePath = path.join(imagesSourceDirCars, image);
                const destinationPath = path.join(uploadsDirCars, image);
    
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, destinationPath);
                    console.log(`📸 Copied car image: ${image}`);
                    return `/uploads/images/cars/${image}`;
                } else {
                    console.warn(`⚠️ Car image not found: ${image}`);
                    return null; // Keep track of missing images
                }
            }).filter(Boolean); // Remove null entries
        } else {
            console.warn(`⚠️ No images found for car: ${car.stockNumber}`);
            car.images = [];
        }
    
        // Assign a random make and model
        if (savedMakes.length > 0) {
            const randomMake = getRandomElement(savedMakes);
            car.make = randomMake._id; // Assign the make ID
            car.model = getRandomElement(randomMake.models); // Assign a random model
        } else {
            console.warn(`⚠️ No makes available to assign to car: ${car.stockNumber}`);
        }
    });
    
    news.forEach((news) => {
      const sourcePath = path.join(imagesSourceDirCars, news.image);
      const destinationPath = path.join(uploadsDirNews, news.image);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`📸 Copied news image: ${news.image}`);
      } else {
        console.warn(`⚠️ news image not found: ${news.image}`);
      }

      news.image = `/uploads/images/cars/${news.image}`;
    });

    // Copy offer images and update paths
    offers.forEach((offer) => {
      const sourcePath = path.join(imagesSourceDirOffers, offer.image);
      const destinationPath = path.join(uploadsDirOffers, offer.image);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`📸 Copied offer image: ${offer.image}`);
      } else {
        console.warn(`⚠️ Offer image not found: ${offer.image}`);
      }

      offer.image = `/uploads/images/offers/${offer.image}`;
    });

    // Insert data into the database
    await SeasonalOffer.insertMany(offers);
    await Feedback.insertMany(feedbacks);
    await News.insertMany(news);
    await Car.insertMany(cars);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

module.exports = { seedData };
