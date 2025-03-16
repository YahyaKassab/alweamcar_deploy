const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/database");
const { createRootAdmin } = require("../adminSeeder");

dotenv.config();

const seedDatabase = async () => {
  try {
    connectDB()

    console.log("📌 Connected to Database!");
    await createRootAdmin();
    
    console.log("✅ Seeding process finished!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
