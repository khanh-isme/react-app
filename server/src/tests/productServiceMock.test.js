import * as productService from '../services/productService';
import Product from '../models/Product.model';

// --- Mock Mongoose Model ---
jest.mock('../models/Product.model');

describe('ProductService (Direct Model Access)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Create
  test('createProduct: Should save to DB via Model', async () => {
    const mockData = { title: 'New Product', price: 100 };
    const savedProduct = { _id: '1', ...mockData };

    // Mock hàm constructor new Product() và hàm .save()
    Product.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedProduct)
    }));

    const result = await productService.createProduct(mockData);

    expect(result).toEqual(savedProduct);
    expect(Product).toHaveBeenCalledWith(mockData);
  });

  // Test Read All
  test('getAllProducts: Should call Product.find()', async () => {
    const mockList = [{ title: 'A' }, { title: 'B' }];
    // Mock hàm tĩnh (static) Product.find
    Product.find.mockResolvedValue(mockList);

    const result = await productService.getAllProducts();

    expect(result).toEqual(mockList);
    expect(Product.find).toHaveBeenCalled();
  });

  // Test Update
  test('updateProduct: Should call Product.findByIdAndUpdate()', async () => {
    const updateData = { price: 200 };
    const updatedProduct = { _id: '1', price: 200 };
    
    Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

    const result = await productService.updateProduct('1', updateData);

    expect(result).toEqual(updatedProduct);
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, expect.any(Object));
  });

  // Test Delete
  test('deleteProduct: Should call Product.findByIdAndDelete()', async () => {
    const deletedProduct = { _id: '1' };
    Product.findByIdAndDelete.mockResolvedValue(deletedProduct);

    const result = await productService.deleteProduct('1');

    expect(result).toEqual(deletedProduct);
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});