import Category from '../models/Category.js'; // Nhớ có đuôi .js

// 1. CREATE: Tạo danh mục mới
export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: savedCategory
    });
  } catch (error) {
    // Xử lý lỗi trùng tên (duplicate key error)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục đã tồn tại"
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo danh mục",
      error: error.message
    });
  }
};

// 2. READ ALL: Lấy tất cả danh mục
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message
    });
  }
};

// 3. READ ONE: Lấy 1 danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server hoặc ID không hợp lệ",
      error: error.message
    });
  }
};

// 4. UPDATE: Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục để cập nhật"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật",
      error: error.message
    });
  }
};

// 5. DELETE: Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục để xóa"
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa danh mục thành công"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa",
      error: error.message
    });
  }
};