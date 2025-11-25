import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true
  },
  email: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  displayName: { type: String, default: "" }
  
});

// Tạo model
export const User = mongoose.model("User", userSchema);



