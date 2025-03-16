const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { seedData } = require("../dataSeeder");
const connectDB = require("../config/database");

dotenv.config();

const seedDatabase = async () => {
  try {
    connectDB()

    console.log("📌 Connected to Database!");
    await seedData();
    
    console.log("✅ Seeding process finished!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
