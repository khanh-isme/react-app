import { validateProduct } from '../utils/ValidationProduct';

describe('Frontend Unit Tests - Product Validation', () => {
  // Dữ liệu mẫu hợp lệ dùng chung
  const validProduct = {
    title: 'iPhone 15 Pro',
    price: 25000000,
    stock: 100,
    description: 'Điện thoại xịn',
    category: 'Điện thoại'
  };
  const validCategories = ['Điện thoại', 'Laptop', 'Phụ kiện'];

  // --- 1. Test Product Name Validation ---
  describe('Product Name (Title)', () => {
    test('should fail if title is empty', () => {
      const result = validateProduct({ ...validProduct, title: '' }, validCategories);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe("Tên sản phẩm không được để trống.");
    });

    test('should fail if title is too short (< 3 chars)', () => {
      const result = validateProduct({ ...validProduct, title: 'AB' }, validCategories);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe("Tên sản phẩm phải có tối thiểu 3 ký tự.");
    });

    test('should fail if title is too long (> 100 chars)', () => {
      const longTitle = 'A'.repeat(101);
      const result = validateProduct({ ...validProduct, title: longTitle }, validCategories);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe("Tên sản phẩm tối đa 100 ký tự.");
    });

    test('should fail if title contains invalid special chars (@, #)', () => {
      const result = validateProduct({ ...validProduct, title: 'iPhone @15' }, validCategories);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe("Tên sản phẩm chứa ký tự đặc biệt không hợp lệ.");
    });

    test('should pass if title is valid (text, numbers, spaces, -, (, ), .)', () => {
      const result = validateProduct({ ...validProduct, title: 'iPhone 15 (New-Version) 1.0' }, validCategories);
      expect(result.isValid).toBe(true);
      expect(result.errors.title).toBeUndefined();
    });
  });

  // --- 2. Test Price Validation (Boundary Tests) ---
  describe('Price', () => {
    test('should fail if price is empty/null/undefined', () => {
      expect(validateProduct({ ...validProduct, price: '' }).errors.price).toBe("Giá sản phẩm không được để trống.");
      expect(validateProduct({ ...validProduct, price: null }).errors.price).toBe("Giá sản phẩm không được để trống.");
    });

    test('should fail if price is not a number (NaN)', () => {
      const result = validateProduct({ ...validProduct, price: 'abc' });
      expect(result.isValid).toBe(false);
      expect(result.errors.price).toBe("Giá sản phẩm phải là số.");
    });

    test('should fail if price is 0 (Boundary)', () => {
      const result = validateProduct({ ...validProduct, price: 0 });
      expect(result.errors.price).toBe("Giá sản phẩm phải lớn hơn 0.");
    });

    test('should fail if price is negative', () => {
      const result = validateProduct({ ...validProduct, price: -5000 });
      expect(result.errors.price).toBe("Giá sản phẩm phải lớn hơn 0.");
    });

    test('should pass if price is max allowed (999,999,999) (Boundary)', () => {
      const result = validateProduct({ ...validProduct, price: 999999999 }, validCategories);
      expect(result.isValid).toBe(true);
    });

    test('should fail if price is over max (> 999,999,999)', () => {
      const result = validateProduct({ ...validProduct, price: 1000000000 });
      expect(result.errors.price).toBe("Giá sản phẩm quá lớn (Tối đa 999,999,999).");
    });
  });


  describe('Quantity (Stock)', () => {
    test('should fail if stock is empty', () => {
      const result = validateProduct({ ...validProduct, stock: '' });
      expect(result.errors.stock).toBe("Số lượng không được để trống.");
    });

    test('should fail if stock is decimal (float)', () => {
      const result = validateProduct({ ...validProduct, stock: 10.5 });
      expect(result.errors.stock).toBe("Số lượng phải là số nguyên (không được lẻ).");
    });

    test('should fail if stock is negative', () => {
      const result = validateProduct({ ...validProduct, stock: -1 });
      expect(result.errors.stock).toBe("Số lượng không được nhỏ hơn 0.");
    });

    test('should pass if stock is 0 (Boundary - allowed)', () => {
      const result = validateProduct({ ...validProduct, stock: 0 }, validCategories);
      expect(result.isValid).toBe(true);
    });

    test('should pass if stock is max allowed (99,999) (Boundary)', () => {
      const result = validateProduct({ ...validProduct, stock: 99999 }, validCategories);
      expect(result.isValid).toBe(true);
    });

    test('should fail if stock is over max (> 99,999)', () => {
      const result = validateProduct({ ...validProduct, stock: 100000 });
      expect(result.errors.stock).toBe("Số lượng quá lớn (Tối đa 99,999).");
    });
  });

  // --- 4. Test Description Length ---
  describe('Description', () => {
    test('should pass if description is empty (optional)', () => {
      const result = validateProduct({ ...validProduct, description: '' }, validCategories);
      expect(result.isValid).toBe(true);
    });

    test('should fail if description is too long (> 500 chars)', () => {
      const longDesc = 'a'.repeat(501);
      const result = validateProduct({ ...validProduct, description: longDesc });
      expect(result.errors.description).toBe("Mô tả không được vượt quá 500 ký tự.");
    });
  });


  describe('Category', () => {
    test('should fail if category is empty', () => {
      const result = validateProduct({ ...validProduct, category: '' }, validCategories);
      expect(result.errors.category).toBe("Danh mục không được để trống.");
    });

    test('should fail if category is not in valid list', () => {
      const result = validateProduct({ ...validProduct, category: 'Xe máy' }, validCategories);
      expect(result.errors.category).toBe("Danh mục không hợp lệ (Phải chọn từ danh sách).");
    });

    test('should pass if category is in valid list', () => {
      const result = validateProduct({ ...validProduct, category: 'Laptop' }, validCategories);
      expect(result.isValid).toBe(true);
    });
    
    // Case không truyền validCategories (mảng rỗng) -> chỉ check rỗng, không check list
    test('should pass if validCategories is not provided but category is not empty', () => {
      const result = validateProduct({ ...validProduct, category: 'Bất kỳ' }, []);
      expect(result.isValid).toBe(true);
    });
  });
});