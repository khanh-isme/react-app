import Product from   '../models/Product.model.js';

// 1. CREATE: Thêm sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    // Lấy dữ liệu từ body request
    const newProduct = new Product(req.body);

    // Lưu vào database
    const savedProduct = await newProduct.save();

    // Trả về kết quả thành công (201 Created)
    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm sản phẩm",
      error: error.message
    });
  }
};

// 2. READ ALL: Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message
    });
  }
};

// 3. READ ONE: Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    // Nếu không tìm thấy
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm với ID này"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server hoặc ID không hợp lệ",
      error: error.message
    });
  }
};

// 4. UPDATE: Cập nhật sản phẩm theo ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // findByIdAndUpdate(id, data, options)
    // new: true -> trả về data sau khi update (mặc định là trả về data cũ)
    // runValidators: true -> chạy lại validate của Schema (ví dụ check min: 0)
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true 
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật",
      error: error.message
    });
  }
};

// 5. DELETE: Xóa sản phẩm theo ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa"
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm thành công"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa",
      error: error.message
    });
  }
};