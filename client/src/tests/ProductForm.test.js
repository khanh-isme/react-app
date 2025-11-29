import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../pages/Shop/ProductForm'; // Đảm bảo đường dẫn đúng

// --- MOCKING ---
// 1. Mock ProductDetailModal
jest.mock('../pages/Shop/ProductDetailModal', () => {
  return function MockModal({ onClose, product }) {
    return (
      <div data-testid="mock-modal">
        <h1>Modal Chi Tiết: {product.title}</h1>
        <button onClick={onClose}>Đóng Modal</button>
      </div>
    );
  };
});

// 2. Mock React Icons
jest.mock("react-icons/fa", () => ({
  FaShoppingCart: () => <span data-testid="cart-icon">CartIcon</span>
}));

describe('ProductForm Component', () => {
  
  // Dữ liệu mẫu khớp với cấu trúc mới (Price là Number)
  const mockProduct = {
    _id: '123',
    image: 'https://example.com/shoe.jpg',
    category: 'Giày dép',
    title: 'Giày Sneaker Test',
    description: 'Mô tả sản phẩm ngắn',
    price: 500000, // QUAN TRỌNG: Truyền số, không truyền string
    sizes: [38, 39, 40]
  };

  afterEach(() => {
    jest.restoreAllMocks(); // Reset spy sau mỗi test
  });

  // 1. Test render giao diện cơ bản
  test('renders product details correctly with formatted price', () => {
    render(<ProductForm {...mockProduct} />);

    // Kiểm tra title và category
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

    // QUAN TRỌNG: Kiểm tra logic format tiền tệ
    // Input là 500000 -> Output mong đợi chứa "500.000"
    // Dùng Regex để tìm tương đối, tránh lỗi dấu cách (space) khác nhau giữa các môi trường
    expect(screen.getByText(/500\.000/)).toBeInTheDocument();
    
    // Kiểm tra ảnh
    const image = screen.getByAltText(mockProduct.title);
    expect(image).toHaveAttribute('src', mockProduct.image);
  });

  // 2. Test logic cắt ngắn mô tả (Truncate Description)
  test('truncates long description correctly', () => {
    const longDescription = "Đây là một đoạn mô tả rất dài, dài hơn 50 ký tự để kiểm tra xem logic cắt chuỗi có hoạt động đúng hay không.";
    const longProduct = { ...mockProduct, description: longDescription };

    render(<ProductForm {...longProduct} />);

    // Logic trong code: description.substring(0, 50) + "..."
    const expectedText = longDescription.substring(0, 50) + "...";
    
    expect(screen.getByText(expectedText)).toBeInTheDocument();
    // Đảm bảo đoạn text gốc quá dài không xuất hiện
    expect(screen.queryByText(longDescription)).not.toBeInTheDocument();
  });

  // 3. Test mở modal khi click vào card
  test('opens modal when clicking on the card body', () => {
    render(<ProductForm {...mockProduct} />);

    // Ban đầu không có modal
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();

    // Click vào ảnh hoặc title (vùng card)
    fireEvent.click(screen.getByText(mockProduct.title));

    // Modal xuất hiện
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  // 4. Test nút "Mua" (Stop Propagation)
  test('does NOT open modal when clicking "Mua" button', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<ProductForm {...mockProduct} />);

    // Tìm nút Mua
    const buyButton = screen.getByRole('button', { name: /Mua/i });
    
    // Click nút Mua
    fireEvent.click(buyButton);

    // Kiểm tra 1: Modal KHÔNG được hiện
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();

    // Kiểm tra 2: Hàm xử lý mua hàng chạy đúng log mới
    // Code mới log: "Quick add:", title
    expect(consoleSpy).toHaveBeenCalledWith("Quick add:", mockProduct.title);
  });

  // 5. Test Fallback Image (Nếu không có ảnh)
  test('renders placeholder image if src is missing', () => {
    const productNoImage = { ...mockProduct, image: null };
    render(<ProductForm {...productNoImage} />);

    const image = screen.getByAltText(productNoImage.title);
    // Kiểm tra xem có fallback về placeholder không (dựa trên code bạn cung cấp: "https://via.placeholder.com/300")
    expect(image).toHaveAttribute('src', "https://via.placeholder.com/300");
  });
});