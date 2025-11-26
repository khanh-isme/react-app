import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Tên danh mục không được trùng nhau
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String, // Link icon hoặc ảnh đại diện cho danh mục
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;