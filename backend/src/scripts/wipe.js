const mongoose = require("mongoose");
const fs = require('fs')
const dotenv = require("dotenv");
const Car = require("../models/Car");
const Feedback = require("../models/Feedback");
const News = require("../models/News");
const connectDB = require("../config/database");
const path  = require("path");
const Make = require("../models/Make");

dotenv.config();
const uploadsDirCars = path.join(__dirname, "../../../uploads/cars");
const uploadsDirOffers = path.join(__dirname, "../../../uploads/offers");
const wipeDatabase = async () => {
  try {
    connectDB()
    console.log(uploadsDirCars)

    console.log("⚠️ Wiping all data...");
    await Car.deleteMany();
    await Feedback.deleteMany();
    await News.deleteMany();
    await Make.deleteMany();
    console.log("🧹 Clearing old data...");
        
        // Delete all images in the uploads directory
        if (fs.existsSync(uploadsDirCars)) {
          fs.readdirSync(uploadsDirCars).forEach((file) => {
            fs.promises.unlink(path.join(uploadsDirCars, file));
        });
        console.log("🗑️ Deleted all images in cars folder.");
        }
        if (fs.existsSync(uploadsDirOffers)) {
          fs.readdirSync(uploadsDirOffers).forEach((file) => {
            fs.promises.unlink(path.join(uploadsDirOffers, file));
        });
        console.log("🗑️ Deleted all images in offers folder.");
        }
    

    console.log("✅ Database wiped successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Wiping failed:", error);
    process.exit(1);
  }
};

wipeDatabase();
