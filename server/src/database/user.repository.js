import mongoose from "mongoose";
import {User} from "../models/user.model.js";
import { connectDB } from "./conect.js";
export async function getUserByName(username) {
  try {
    
    const user = await User.findOne({ name: username }).lean();
    return user;

  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}
export async function createUser(data) {
  return await User.create(data);
}


 
