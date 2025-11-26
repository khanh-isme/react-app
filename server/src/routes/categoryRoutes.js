import express from 'express';
import * as categoryController from '../controllers/categoryController.js'; // Nhớ * as và đuôi .js

const router = express.Router();

// Đường dẫn gốc: /api/categories

// GET: Lấy tất cả & POST: Tạo mới
router.route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

// GET, PUT, DELETE theo ID
router.route('/:id')
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;