import Product from "../models/Product.model.js";

// CREATE
export const createProduct = async (data) => {
  const newProduct = new Product(data);
  return await newProduct.save();
};

// GET ALL (KHÔNG PHÂN TRANG)
export const getAllProducts = async () => {
  return await Product.find();
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
