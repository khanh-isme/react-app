import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  // Mẹo nhỏ: Viết gọn lại mảng String như thế này cho dễ đọc
  sizes: [String], 
  // Thay vì: sizes: [{ type: String }]
  
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// SỬ DỤNG EXPORT DEFAULT (Khuyên dùng)
const Product = mongoose.model('Product', productSchema);
export default Product;