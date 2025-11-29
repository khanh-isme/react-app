import { 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getAllProducts 
} from '../services/productService'; 
import Product from '../models/Product.model.js'; 

// Mock Mongoose Model
jest.mock('../models/Product.model.js');

describe('ProductService', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. Test createProduct ---
  describe('createProduct', () => {
    test('should create and return a new product', async () => {
      const mockData = { title: 'New Product', price: 100 };
      const savedProduct = { _id: '123', ...mockData };

      Product.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedProduct)
      }));

      const result = await createProduct(mockData);

      expect(result).toEqual(savedProduct);
      expect(Product).toHaveBeenCalledWith(mockData);
    });
  });

  // --- 2. Test getProductById ---
  describe('getProductById', () => {
    test('should return product if found', async () => {
      const mockProduct = { _id: '123', title: 'Test' };
      Product.findById.mockResolvedValue(mockProduct);

      const result = await getProductById('123');
      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith('123');
    });

    test('should return null if not found', async () => {
      Product.findById.mockResolvedValue(null);
      const result = await getProductById('999');
      expect(result).toBeNull();
    });
  });

  // --- 3. Test updateProduct ---
  describe('updateProduct', () => {
    test('should update and return the new product', async () => {
      const mockProduct = { _id: '123', title: 'Updated' };
      Product.findByIdAndUpdate.mockResolvedValue(mockProduct);

      const result = await updateProduct('123', { title: 'Updated' });
      
      expect(result).toEqual(mockProduct);
      // FIXED: Thêm runValidators: true để khớp với code implementation
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        '123', 
        { title: 'Updated' }, 
        { new: true, runValidators: true }
      );
    });
  });

  // --- 4. Test deleteProduct ---
  describe('deleteProduct', () => {
    test('should delete and return the deleted product', async () => {
      const mockProduct = { _id: '123', title: 'Deleted' };
      Product.findByIdAndDelete.mockResolvedValue(mockProduct);

      const result = await deleteProduct('123');
      
      expect(result).toEqual(mockProduct);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });

  // --- 5. Test getAllProducts with Pagination ---
  describe('getAllProducts', () => {
    test('should return paginated result', async () => {
      const mockProducts = [{ title: 'P1' }, { title: 'P2' }];
      const totalDocs = 20;

      // Mock chain: find -> sort -> skip -> limit
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockProducts)
      };

      Product.find.mockReturnValue(mockChain);
      Product.countDocuments.mockResolvedValue(totalDocs);

      const result = await getAllProducts(2, 10);

      expect(Product.find).toHaveBeenCalled();
      expect(mockChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockChain.skip).toHaveBeenCalledWith(10);
      expect(mockChain.limit).toHaveBeenCalledWith(10);

      // Kiểm tra kết quả trả về đúng cấu trúc pagination
      expect(result).toEqual({
        products: mockProducts,
        total: 20,
        totalPages: 2,
        currentPage: 2
      });
    });

    test('should use default pagination values', async () => {
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      Product.find.mockReturnValue(mockChain);
      Product.countDocuments.mockResolvedValue(0);

      await getAllProducts(); 

      expect(mockChain.skip).toHaveBeenCalledWith(0);
      expect(mockChain.limit).toHaveBeenCalledWith(10);
    });
  });
});