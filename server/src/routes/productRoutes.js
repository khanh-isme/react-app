import express from'express';
const router = express.Router();
import * as productController from '../controllers/productController.js';

// Định nghĩa các route

// GET: Lấy tất cả & POST: Tạo mới
router.route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

// GET: Lấy 1 cái, PUT: Sửa, DELETE: Xóa (Dựa theo :id)
router.route('/:id')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;