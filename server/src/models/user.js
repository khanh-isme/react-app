import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true
  }
});

// Tạo model
export const User = mongoose.model("User", userSchema);



