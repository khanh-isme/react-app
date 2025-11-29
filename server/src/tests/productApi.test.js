import request from 'supertest';
import express from 'express';
import * as productController from '../controllers/productController';
import * as productService from '../services/productService';

// --- MOCK SERVICE ---
jest.mock('../services/productService');

// --- SETUP EXPRESS APP ---
const app = express();
app.use(express.json());

app.post('/api/products', productController.createProduct);
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

describe('Product API Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- a) POST CREATE ---
  test('POST /api/products - Should create product and return 201', async () => {
    const mockProduct = { _id: '1', title: 'New Phone', price: 1000 };

    productService.createProduct.mockResolvedValue(mockProduct);

    const res = await request(app)
      .post('/api/products')
      .send({ title: 'New Phone', price: 1000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockProduct);
  });

  // --- b) GET ALL PRODUCTS ---
  test('GET /api/products - Should return list of products with pagination', async () => {

    const mockResponse = {
      products: [{ title: "P1" }, { title: "P2" }],
      total: 2,
      totalPages: 1,
      currentPage: 1
    };

    productService.getAllProducts.mockResolvedValue(mockResponse);

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Kiểm tra pagination
    expect(res.body.total).toBe(2);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.currentPage).toBe(1);

    // Kiểm tra data
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(mockResponse.products);

    expect(productService.getAllProducts).toHaveBeenCalled();
  });

  // --- c) GET BY ID ---
  test('GET /api/products/:id - Should return product if found', async () => {
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

  // --- d) UPDATE ---
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

  test('PUT /api/products/:id - Should return 404 if product not found', async () => {
    productService.updateProduct.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/products/999')
      .send({ title: 'Test' });

    expect(res.statusCode).toBe(404);
  });

  // --- e) DELETE ---
  test('DELETE /api/products/:id - Should delete product and return 200', async () => {
    const deletedMock = { _id: '123', title: 'Deleted' };

    productService.deleteProduct.mockResolvedValue(deletedMock);

    const res = await request(app).delete('/api/products/123');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Đã xóa/i);
    expect(productService.deleteProduct).toHaveBeenCalledWith('123');
  });

  test('DELETE /api/products/:id - Should return 404 if product not found', async () => {
    productService.deleteProduct.mockResolvedValue(null);

    const res = await request(app).delete('/api/products/999');

    expect(res.statusCode).toBe(404);
  });

});
