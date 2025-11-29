import Product from "../models/Product.model.js";

// CREATE
export const createProduct = async (data) => {
  const newProduct = new Product(data);
  return await newProduct.save();
};

// GET ALL với pagination
export const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // 1. Lấy danh sách sản phẩm
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // 2. Đếm tổng số lượng (để tính totalPages)
  const total = await Product.countDocuments();

  // 3. Trả về object kết quả đầy đủ
  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
};

// GET BY ID
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// UPDATE
export const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// DELETE
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};