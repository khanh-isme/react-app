import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../pages/Shop/ProductForm';

// --- MOCKING ---
// 1. Mock ProductDetailModal: Giả lập component này đơn giản để dễ kiểm tra
jest.mock('../pages/Shop/ProductDetailModal', () => {
  return function MockModal({ onClose }) {
    return (
      <div data-testid="mock-modal">
        <h1>Modal Chi Tiết</h1>
        <button onClick={onClose}>Đóng Modal</button>
      </div>
    );
  };
});

// 2. Mock React Icons: Để tránh lỗi khi render icon SVG
jest.mock("react-icons/fa", () => ({
  FaShoppingCart: () => <span data-testid="cart-icon">Icon</span>
}));

describe('ProductForm Component', () => {
  // Dữ liệu mẫu để truyền vào props
  const mockProduct = {
    image: 'https://example.com/shoe.jpg',
    category: 'Giày dép',
    title: 'Giày Sneaker Test',
    description: 'Mô tả sản phẩm test',
    price: '500.000 ₫'
  };

  // 1. Test render giao diện
  test('renders product details correctly', () => {
    render(<ProductForm {...mockProduct} />);

    // Kiểm tra các thông tin text có xuất hiện không
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.price)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    
    // Kiểm tra ảnh có src và alt đúng không
    const image = screen.getByAltText(mockProduct.title);
    expect(image).toHaveAttribute('src', mockProduct.image);
  });

  // 2. Test mở modal khi click vào card
  test('opens modal when clicking on the card body', () => {
    render(<ProductForm {...mockProduct} />);

    // Ban đầu modal KHÔNG được có trong document
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();

    // Click vào tên sản phẩm (nằm trong vùng click của card)
    fireEvent.click(screen.getByText(mockProduct.title));

    // Sau khi click, modal PHẢI xuất hiện
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  // 3. Test nút "Mua" (Quan trọng: Stop Propagation)
  test('does NOT open modal when clicking "Mua" button', () => {
    // Spy console.log để đảm bảo hàm onClick của nút Mua đã chạy
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<ProductForm {...mockProduct} />);

    // Tìm nút Mua
    const buyButton = screen.getByRole('button', { name: /Mua/i });
    
    // Click nút Mua
    fireEvent.click(buyButton);

    // Kiểm tra 1: Modal VẪN KHÔNG được hiện (do e.stopPropagation())
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();

    // Kiểm tra 2: Hàm xử lý mua hàng đã chạy (dựa vào log)
    expect(consoleSpy).toHaveBeenCalledWith("Đã thêm vào giỏ, không mở modal");

    consoleSpy.mockRestore();
  });

  // 4. Test đóng modal
  test('closes modal when clicking close button inside modal', () => {
    render(<ProductForm {...mockProduct} />);

    // Mở modal lên trước
    fireEvent.click(screen.getByText(mockProduct.title));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();

    // Click nút Đóng trong mock modal
    fireEvent.click(screen.getByText('Đóng Modal'));

    // Modal phải biến mất
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });
});