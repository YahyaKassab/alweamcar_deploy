const mongoose = require("mongoose");
const fs = require('fs');
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Car = require("../models/Car");
const SeasonalOffer = require("../models/SeasonalOffer");
const Feedback = require("../models/Feedback");
const News = require("../models/News");
const Make = require("../models/Make");
const connectDB = require("../config/database");

// Load environment variables
dotenv.config();

// Configure and verify Cloudinary
const configureCloudinary = () => {
  console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set'
  });

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

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload', // Added required type parameter
      max_results: 1
    });
    console.log('✅ Cloudinary connection test successful');
    return true;
  } catch (error) {
    throw new Error(`Cloudinary connection test failed: ${error.message || JSON.stringify(error)}`);
  }
};

const wipeDatabase = async () => {
  let connection;
  try {
    // Connect to MongoDB
    connection = await connectDB();
    console.log("⚠️ Wiping all data...");

    // Wipe MongoDB collections
    await Car.deleteMany();
    await SeasonalOffer.deleteMany();
    await Feedback.deleteMany();
    await News.deleteMany();
    await Make.deleteMany();
    console.log("✅ MongoDB collections wiped successfully!");

    // Configure and test Cloudinary
    configureCloudinary();
    await testCloudinaryConnection();

    // Wipe Cloudinary images from specific Alweam subfolders
    console.log("⚠️ Deleting Cloudinary images from Alweam subfolders...");
    
    const folders = ['Alweam/cars', 'Alweam/offers', 'Alweam/news'];

    for (const folder of folders) {
      console.log(`Processing folder: ${folder}`);
      
      const deleteFolderResources = async (next_cursor = null) => {
        try {
          const result = await cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload', // Added required type parameter
            prefix: folder,
            max_results: 500,
            next_cursor: next_cursor,
          });

          console.log(`Found ${result.resources.length} resources in ${folder}`);

          const publicIds = result.resources.map(resource => resource.public_id);
          if (publicIds.length > 0) {
            await cloudinary.api.delete_resources(publicIds, {
              resource_type: 'image'
            });
            console.log(`Deleted ${publicIds.length} images from ${folder}`);
          } else {
            console.log(`No images found in ${folder}`);
          }

          if (result.next_cursor) {
            await deleteFolderResources(result.next_cursor);
          }
        } catch (cloudinaryError) {
          throw new Error(`Cloudinary operation failed for ${folder}: ${cloudinaryError.message || JSON.stringify(cloudinaryError)}`);
        }
      };

      await deleteFolderResources();
    }

    console.log("✅ All images in Alweam subfolders deleted successfully!");
    console.log("✅ Database and Cloudinary wipe completed!");
  } catch (error) {
    console.error("❌ Wipe failed:", error.message || JSON.stringify(error));
    process.exit(1);
  } finally {
    // Ensure MongoDB connection closes
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
    process.exit(0);
  }
};

wipeDatabase();