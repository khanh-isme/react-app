import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// --- IMPORT COMPONENTS ---
import Shop from '../pages/Shop/shop'; // Đảm bảo đúng tên file Shop.js

// --- IMPORT API ---
import * as productRequest from '../api/requests/product';

// --- MOCKING ---

// 1. Mock API module
jest.mock('../api/requests/product');

// 2. Mock Cart Component (Giả lập Cart để test việc mở/đóng)
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

// 3. Mock React Icons
jest.mock("react-icons/fa", () => ({
  FaShoppingCart: () => <span data-testid="cart-icon">CartIcon</span>,
  FaMinus: () => <span>-</span>,
  FaPlus: () => <span>+</span>
}));
jest.mock("react-icons/io5", () => ({
  IoClose: () => <span>CloseIcon</span>
}));

describe('Frontend Product Integration Tests (Shop & Detail)', () => {
  
  // Dữ liệu giả lập khớp với cấu trúc Backend mới (Price là Number)
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

  // --- Test Case 1: Hiển thị danh sách sản phẩm ---
  test('Shop: Fetches products from API and renders ProductCards', async () => {
    // Mock trả về cấu trúc giống Controller: { success: true, data: [...] }
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<Shop />);

    // Kiểm tra API được gọi
    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(1);
    });

    // Kiểm tra UI hiển thị sản phẩm
    expect(await screen.findByText('iPhone 15 Pro')).toBeInTheDocument();
    
    // Kiểm tra giá tiền đã được format (Shop truyền number -> Form format thành string)
    // Regex tìm chuỗi "25.000.000" bất kể ký tự tiền tệ
    expect(await screen.findByText(/25\.000\.000/)).toBeInTheDocument();
  });

  // --- Test Case 2: Mở Cart Overlay ---
  test('Shop: Opens Cart overlay when clicking cart button', async () => {
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });
    render(<Shop />);

    // Ban đầu chưa có Cart
    expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();

    // Tìm nút Giỏ hàng ở Header
    const cartBtn = screen.getByRole('button', { name: /Giỏ hàng/i });
    fireEvent.click(cartBtn);

    // Cart xuất hiện
    expect(await screen.findByTestId('mock-cart')).toBeInTheDocument();
  });

  // --- Test Case 3: Tích hợp ProductDetail (Mở Modal -> Thêm giỏ) ---
  test('ProductDetail: Opens modal, selects size/quantity and adds to cart', async () => {
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });
    
    // Mock window.alert để không hiện popup thật
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Render Shop
    render(<Shop />);

    // 1. Chờ load và Click vào tên sản phẩm để mở Modal (Card Body click)
    const productTitle = await screen.findByText('iPhone 15 Pro');
    fireEvent.click(productTitle);

    // 2. Chờ Modal mở
    await waitFor(() => {
      // Tìm text đặc trưng trong Modal
      expect(screen.getByText('Mô tả sản phẩm')).toBeInTheDocument();
    });

    // 3. Test logic Modal: Tăng số lượng
    // Tìm nút "+" trong modal (đã mock icon thành text "+")
    const plusBtn = screen.getByText('+');
    fireEvent.click(plusBtn); 
    // Kiểm tra số lượng tăng lên 2
    expect(screen.getByText('2')).toBeInTheDocument();

    // 4. Test Validation: Bấm thêm giỏ khi chưa chọn size
    const addToCartBtn = screen.getByText(/Thêm vào giỏ/i); // Text button chứa "Thêm vào giỏ"
    fireEvent.click(addToCartBtn);
    expect(window.alert).toHaveBeenCalledWith("Vui lòng chọn size!");

    // 5. Test chọn size và thêm thành công
    const sizeBtn = screen.getByText('256GB');
    fireEvent.click(sizeBtn); // Chọn size
    
    fireEvent.click(addToCartBtn); // Bấm mua lần nữa

    // Kiểm tra alert thành công
    expect(window.alert).toHaveBeenCalledWith("Đã thêm vào giỏ hàng thành công!");
    
    // Clean up
    window.alert.mockRestore();
  });
});