import mongoose from "mongoose";
import {User} from "../models/user.js"

async function getUserByName(username) {
  try {
    await mongoose.connect("mongodb://localhost:27017/ins");

    const user = await User.findOne({ name: username });
    console.log("✅ User found:", user);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

getUserByName("aa");
