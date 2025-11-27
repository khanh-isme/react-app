import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// --- IMPORT COMPONENTS ---
// Lưu ý: Đảm bảo đường dẫn import khớp với cấu trúc thư mục của bạn
import Shop from '../pages/Shop/shop'; 

// --- IMPORT API ---
// Import hàm API thật để mock
import * as productRequest from '../api/requests/product';

// --- MOCKING ---

// 1. Mock API module
jest.mock('../api/requests/product');

// 2. Mock Component con (Cart) để tránh lỗi nếu file không tồn tại hoặc phức tạp
jest.mock('../pages/Shop/Cart', () => {
  return function MockCart({ onClose }) {
    return (
      <div data-testid="mock-cart">
        <h1>Giỏ hàng Mock</h1>
        <button onClick={onClose}>Đóng Cart</button>
      </div>
    );
  };
});

// 3. Mock React Icons để tránh lỗi render SVG
jest.mock("react-icons/fa", () => ({
  FaShoppingCart: () => <span data-testid="cart-icon">CartIcon</span>,
  FaMinus: () => <span>-</span>,
  FaPlus: () => <span>+</span>
}));
jest.mock("react-icons/io5", () => ({
  IoClose: () => <span>CloseIcon</span>
}));

describe('Frontend Product Integration Tests (Shop & Detail)', () => {
  
  // Dữ liệu giả lập khớp với cấu trúc MongoDB (_id)
  const mockProducts = [
    { 
      _id: '1', 
      title: 'iPhone 15 Pro', 
      price: 25000000, 
      category: 'Điện thoại', 
      image: 'iphone.jpg',
      description: 'Titan tự nhiên',
      sizes: ['256GB', '512GB'] 
    },
    { 
      _id: '2', 
      title: 'MacBook Air M2', 
      price: 30000000, 
      category: 'Laptop',
      image: 'macbook.jpg',
      description: 'Siêu mỏng nhẹ',
      sizes: ['8GB', '16GB']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Test Case 1: Hiển thị danh sách sản phẩm (ProductList Integration) ---
  test('Shop: Fetches products from API and renders ProductCards', async () => {
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<Shop />);

    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(await screen.findByText('MacBook Air M2')).toBeInTheDocument();
    
    expect(await screen.findByText(/25\.000\.000/)).toBeInTheDocument();
  });

  // --- Test Case 2: Mở Cart Overlay ---
  test('Shop: Opens Cart overlay when clicking cart button', async () => {
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });
    render(<Shop />);

    expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();

    const cartBtn = screen.getByRole('button', { name: /Giỏ hàng/i });
    fireEvent.click(cartBtn);

    expect(await screen.findByTestId('mock-cart')).toBeInTheDocument();
  });

  // --- Test Case 3: Tích hợp ProductDetail (Click Card -> Mở Modal -> Thêm giỏ) ---
  test('ProductDetail: Opens modal, selects size/quantity and adds to cart', async () => {
    // Setup
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Shop />);

    // 1. Chờ sản phẩm load và click vào sản phẩm đầu tiên
    const productItem = await screen.findByText('iPhone 15 Pro');
    fireEvent.click(productItem);

    // 2. Kiểm tra Modal đã mở
    await waitFor(() => {
      // Text này chỉ có trong modal
      expect(screen.getByText('Mô tả sản phẩm')).toBeInTheDocument(); 
      
      // SỬA LỖI Ở ĐÂY: Dùng getAllByText vì text này xuất hiện 2 lần (Card + Modal)
      const descriptions = screen.getAllByText('Titan tự nhiên');
      expect(descriptions.length).toBeGreaterThan(0); 
    });

    // 3. Test logic trong Modal: Tăng số lượng
    const plusBtn = screen.getByText('+');
    fireEvent.click(plusBtn); // Tăng lên 2
    expect(screen.getByText('2')).toBeInTheDocument();

    // 4. Test logic: Thử bấm thêm vào giỏ khi CHƯA chọn size (Mong đợi alert)
    const addToCartBtn = screen.getByText(/Thêm vào giỏ hàng/i);
    fireEvent.click(addToCartBtn);
    expect(window.alert).toHaveBeenCalledWith("Vui lòng chọn size!");

    // 5. Test logic: Chọn size và Thêm vào giỏ thành công
    const sizeBtn = screen.getByText('256GB');
    fireEvent.click(sizeBtn); // Chọn size
    fireEvent.click(addToCartBtn); // Thêm lại

    // 6. Kiểm tra console.log
    expect(consoleSpy).toHaveBeenCalledWith(
        "Thêm vào giỏ:", 
        expect.objectContaining({
            title: 'iPhone 15 Pro',
            quantity: 2,
            selectedSize: '256GB'
        })
    );

    consoleSpy.mockRestore();
  });
});