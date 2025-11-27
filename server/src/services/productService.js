import Product from '../models/Product.model.js';

// 1. Create Product
export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

// 2. Get Product By ID
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// 3. Update Product
export const updateProduct = async (id, updateData) => {
  // new: true để trả về dữ liệu sau khi update
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

// 4. Delete Product
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// 5. Get All Products with Pagination
export const getAllProducts = async (page = 1, limit = 10) => {
  // Chuyển đổi sang số nguyên đề phòng đầu vào là string
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Query dữ liệu
  const products = await Product.find()
    .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
    .skip(skip)
    .limit(limitNumber);

  // Đếm tổng số lượng để frontend biết có bao nhiêu trang
  const total = await Product.countDocuments();

  return {
    products,
    total,
    totalPages: Math.ceil(total / limitNumber),
    currentPage: pageNumber
  };
};