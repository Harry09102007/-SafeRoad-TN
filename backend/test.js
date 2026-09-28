import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Connecting to:", process.env.MONGO_URI.replace(/:(.*?)@/, ":********@"));

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected successfully!");
  process.exit(0);
} catch (err) {
  console.error("Full error:");
  console.error(err);
  process.exit(1);
}