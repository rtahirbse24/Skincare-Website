import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product"; // adjust if needed
import fs from "fs";
import path from "path";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("✅ MongoDB connected");

    // 📂 read JSON file
    const filePath = path.join(__dirname, "../../../frontend/data/store.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // ❗ delete old products
    await Product.deleteMany();
    console.log("🗑 Old products deleted");

    // ✅ insert new products
    await Product.insertMany(data.products);
    console.log("🚀 New products inserted");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();