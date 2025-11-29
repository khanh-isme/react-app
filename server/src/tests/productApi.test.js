import request from 'supertest';
import express from 'express';
import * as productController from '../controllers/productController';
import * as productService from '../services/productService';

// --- MOCKING ---
// Mock toàn bộ Product Service
jest.mock('../services/productService');

// --- SETUP APP ---
const app = express();
app.use(express.json());

// Định nghĩa Routes cho môi trường test
app.post('/api/products', productController.createProduct);
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

describe('Product API Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- a) Test POST /api/products (Create) (1 điểm) ---
  test('POST /api/products - Should create product and return 201', async () => {
    const mockProduct = { _id: '1', title: 'New Phone', price: 1000 };
    // Mock service trả về sản phẩm mới
    productService.createProduct.mockResolvedValue(mockProduct);

    const res = await request(app)
      .post('/api/products')
      .send({ title: 'New Phone', price: 1000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockProduct);
    expect(productService.createProduct).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Phone' }));
  });

  // --- b) Test GET /api/products (Read all) (1 điểm) ---
  // ĐÃ SỬA: Cập nhật theo code controller/service mới (Không phân trang)
  test('GET /api/products - Should return list of products and 200', async () => {
    const mockList = [{ title: 'P1' }, { title: 'P2' }];
    
    // Service trả về mảng trực tiếp (theo code bạn cung cấp)
    productService.getAllProducts.mockResolvedValue(mockList);

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Controller của bạn trả về: count và data
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(mockList);
    
    expect(productService.getAllProducts).toHaveBeenCalled(); 
  });

  // --- c) Test GET /api/products/{id} (Read one) (1 điểm) ---
  test('GET /api/products/:id - Should return product if found (200)', async () => {
    const mockProduct = { _id: '123', title: 'P1' };
    productService.getProductById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual(mockProduct);
  });

  test('GET /api/products/:id - Should return 404 if not found', async () => {
    productService.getProductById.mockResolvedValue(null);

    const res = await request(app).get('/api/products/999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Không tìm thấy/i);
  });

  // --- d) Test PUT /api/products/{id} (Update) (1 điểm) ---
  test('PUT /api/products/:id - Should update product and return 200', async () => {
    const updatedMock = { _id: '123', title: 'Updated Name' };
    productService.updateProduct.mockResolvedValue(updatedMock);

    const res = await request(app)
      .put('/api/products/123')
      .send({ title: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Name');
    expect(productService.updateProduct).toHaveBeenCalledWith('123', { title: 'Updated Name' });
  });

  test('PUT /api/products/:id - Should return 404 if product to update not found', async () => {
    productService.updateProduct.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/products/999')
      .send({ title: 'Test' });

    expect(res.statusCode).toBe(404);
  });

  // --- e) Test DELETE /api/products/{id} (Delete) (1 điểm) ---
  test('DELETE /api/products/:id - Should delete product and return 200', async () => {
    const deletedMock = { _id: '123', title: 'Deleted' };
    productService.deleteProduct.mockResolvedValue(deletedMock);

    const res = await request(app).delete('/api/products/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Đã xóa/i);
    expect(productService.deleteProduct).toHaveBeenCalledWith('123');
  });

  test('DELETE /api/products/:id - Should return 404 if product to delete not found', async () => {
    productService.deleteProduct.mockResolvedValue(null);

    const res = await request(app).delete('/api/products/999');

    expect(res.statusCode).toBe(404);
  });
});