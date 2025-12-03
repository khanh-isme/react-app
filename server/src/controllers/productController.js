import * as productService from "../services/productService.js";

// CREATE
export const createProduct = async (req, res) => {
  try {
    const savedProduct = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi thêm sản phẩm", error: error.message });
  }
};

// GET ALL
export const getAllProducts = async (req, res) => {
  try {
    // Lấy page và limit từ query ?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const result = await productService.getAllProducts(page, limit);

    res.status(200).json({
      success: true,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      count: result.products.length,
      data: result.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};


// GET BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật", error: error.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa", error: error.message });
  }
};
