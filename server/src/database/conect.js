import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ins");
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
