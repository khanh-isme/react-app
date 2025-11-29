import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Import Component chính (bao gồm cả Modal bên trong nó)
import ProductManager from '../pages/ProductManagement/ProductManagement';
// Import API thật để lấy đối tượng mock
import * as productRequest from '../api/requests/product';

// --- YÊU CẦU a) Mock CRUD operations (1.5 điểm) ---
// Mock toàn bộ module api/requests/product
jest.mock('../api/requests/product');

// Mock các Icon để tránh lỗi render
jest.mock("react-icons/fa", () => ({
  FaSearch: () => <span>SearchIcon</span>,
  FaPlus: () => <span>PlusIcon</span>,
  FaRegEdit: () => <span>EditIcon</span>,
  FaTrashAlt: () => <span>DeleteIcon</span>
}));
jest.mock("react-icons/io5", () => ({
  IoClose: () => <span>CloseIcon</span>,
  IoCloudUploadOutline: () => <span>UploadIcon</span>,
  IoTrashOutline: () => <span>TrashIcon</span>
}));

describe('5.2.1 Frontend Mocking - ProductManager & Modal', () => {
  
  // Dữ liệu giả lập
  const mockProducts = [
    {
      _id: '1',
      title: 'iPhone 15 Pro',
      price: 25000000,
      category: 'Thời trang', // Để khớp với logic badge màu
      description: 'Titan tự nhiên',
      image: 'img.jpg',
      sizes: ['S', 'M']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert và window.confirm
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true); // Luôn chọn OK khi xóa
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- YÊU CẦU b) Test success và failure scenarios (0.5 điểm) ---

  // 1. Test READ Success (Lấy danh sách thành công)
  test('READ: Fetches and displays products successfully', async () => {
    // Setup Mock trả về thành công
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<ProductManager />);

    // --- YÊU CẦU c) Verify all mock calls (0.5 điểm) ---
    await waitFor(() => {
      // Kiểm tra hàm API đã được gọi 1 lần khi mount
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(1);
    });

    // Kiểm tra UI hiển thị đúng tên sản phẩm
    expect(await screen.findByText('iPhone 15 Pro')).toBeInTheDocument();
    // Kiểm tra hiển thị giá đã format
    expect(screen.getByText(/25\.000\.000/)).toBeInTheDocument();
  });

  // 2. Test READ Failure (Lỗi API)
  test('READ: Handles fetch failure gracefully (Shows empty state)', async () => {
    // Setup Mock trả về lỗi (hoặc throw error)
    productRequest.getAllProducts.mockRejectedValue(new Error("Lỗi mạng"));
    // Spy console.error để không in rác ra màn hình test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ProductManager />);

    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalled();
    });

    // Kiểm tra UI hiển thị trạng thái trống
    expect(await screen.findByText('Không có sản phẩm nào.')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  // 3. Test CREATE Success (Mở modal -> Điền form -> Submit thành công)
  test('CREATE: Opens modal and submits new product successfully', async () => {
    // Setup: List rỗng ban đầu
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });
    // Setup: Create thành công
    productRequest.createProduct.mockResolvedValue({ success: true });

    render(<ProductManager />);

    // 1. Click nút "Thêm sản phẩm"
    fireEvent.click(screen.getByText('Thêm sản phẩm'));

    // 2. Điền form trong Modal
    // (Dựa vào placeholder trong code ProductFormModal của bạn)
    fireEvent.change(screen.getByPlaceholderText(/Ví dụ: Áo thun nam/i), { target: { value: 'New Item' } });
    fireEvent.change(screen.getByPlaceholderText(/Ví dụ: 100000/i), { target: { value: '50000' } });
    
    // Chọn danh mục (Combobox)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Thời trang' } });

    // 3. Click Submit ("Thêm mới")
    fireEvent.click(screen.getByText('Thêm mới'));

    // --- Verify Mock Calls ---
    await waitFor(() => {
      // Kiểm tra createProduct được gọi với đúng dữ liệu đã điền
      expect(productRequest.createProduct).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Item',
        price: 50000,
        category: 'Thời trang'
      }));
    });

    // Kiểm tra Alert thành công
    expect(window.alert).toHaveBeenCalledWith("Thêm mới thành công!");
    
    // Kiểm tra danh sách được load lại (getAllProducts gọi lần 2)
    expect(productRequest.getAllProducts).toHaveBeenCalledTimes(2);
  });

  // 4. Test CREATE Failure (Lỗi từ server khi tạo)
  test('CREATE: Handles submission error from API', async () => {
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });
    // Setup: Create thất bại
    productRequest.createProduct.mockResolvedValue({ success: false, message: 'Tên trùng lặp' });

    render(<ProductManager />);

    // Mở modal và submit ngay (test validation hoặc lỗi server trả về)
    fireEvent.click(screen.getByText('Thêm sản phẩm'));
    fireEvent.click(screen.getByText('Thêm mới'));

    await waitFor(() => {
      expect(productRequest.createProduct).toHaveBeenCalled();
    });

    // Kiểm tra Alert lỗi
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Có lỗi xảy ra'));
  });

  // 5. Test DELETE Success (Xóa sản phẩm)
  test('DELETE: Calls delete API and refreshes list', async () => {
    // Setup: Có 1 sản phẩm
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });
    // Setup: Delete thành công
    productRequest.deleteProduct.mockResolvedValue({ success: true });

    render(<ProductManager />);

    // Chờ sản phẩm hiện lên
    await screen.findByText('iPhone 15 Pro');

    // Click nút Xóa (DeleteIcon)
    const deleteBtns = screen.getAllByText('DeleteIcon');
    fireEvent.click(deleteBtns[0]); // Click nút xóa của sản phẩm đầu tiên

    // Verify Confirm & API Call
    expect(window.confirm).toHaveBeenCalled();
    expect(productRequest.deleteProduct).toHaveBeenCalledWith('1'); // ID của mockProduct

    // Verify Refresh List
    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(2);
    });
    
    expect(window.alert).toHaveBeenCalledWith("Đã xóa sản phẩm thành công!");
  });
});