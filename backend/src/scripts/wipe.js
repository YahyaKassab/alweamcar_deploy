const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Car = require('../models/Car');
const SeasonalOffer = require('../models/SeasonalOffer');
const Feedback = require('../models/Feedback');
const News = require('../models/News');
const Make = require('../models/Make');
const FAQ = require('../models/FAQ');
const Partner = require('../models/Partner');
const connectDB = require('../config/database');

// Load environment variables
dotenv.config();

// Set image directories - updated to match volume mount
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'public', 'uploads');
const imagesDestDirCars = path.join(uploadsBaseDir, 'cars');
const imagesDestDirOffers = path.join(uploadsBaseDir, 'offers');
const imagesDestDirNews = path.join(uploadsBaseDir, 'news');
const imagesDestDirPartners = path.join(uploadsBaseDir, 'partners');

// Function to wipe a directory
const wipeDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dirPath)) {
      fs.readdir(dirPath, (err, files) => {
        if (err) return reject(err);

        Promise.all(
          files.map((file) => {
            const filePath = path.join(dirPath, file);
            return new Promise((res, rej) => {
              fs.unlink(filePath, (err) => {
                if (err) rej(err);
                else res();
              });
            });
          })
        )
          .then(() => {
            console.log(`✅ Deleted all files in ${dirPath}`);
            resolve();
          })
          .catch(reject);
      });
    } else {
      console.log(`ℹ️ Directory ${dirPath} does not exist, nothing to wipe`);
      resolve();
    }
  });
};

const wipeDatabase = async () => {
  let connection;
  try {
    // Connect to MongoDB
    connection = await connectDB();
    console.log('⚠️ Wiping all data...');

    // Wipe MongoDB collections
    await Car.deleteMany();
    await SeasonalOffer.deleteMany();
    await Feedback.deleteMany();
    await News.deleteMany();
    await Make.deleteMany();
    await FAQ.deleteMany();
    await Partner.deleteMany();
    console.log('✅ MongoDB collections wiped successfully!');

    // Wipe local image directories
    console.log('⚠️ Deleting local images from uploads subfolders...');
    const folders = [
      imagesDestDirCars,
      imagesDestDirOffers,
      imagesDestDirNews,
      imagesDestDirPartners,
    ];

    for (const folder of folders) {
      console.log(`Processing folder: ${folder}`);
      await wipeDirectory(folder);
    }

    console.log('✅ All images in uploads subfolders deleted successfully!');
    console.log('✅ Database and local storage wipe completed!');
  } catch (error) {
    console.error('❌ Wipe failed:', error.message || JSON.stringify(error));
    process.exit(1);
  } finally {
    // Ensure MongoDB connection closes
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  }
};

wipeDatabase();
