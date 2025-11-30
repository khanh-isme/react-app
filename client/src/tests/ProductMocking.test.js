import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Import Component
import ProductManager from '../pages/ProductManagement/ProductManagement'; 
// Import API Requests
import * as productRequest from '../api/requests/product';

// --- MOCKING ---

// 1. Mock API module
jest.mock('../api/requests/product');

// 2. Mock React Icons (Quan trọng: Mock đủ các thư viện bạn dùng)
jest.mock("react-icons/fa", () => ({
  FaSearch: () => <span data-testid="icon-search">Search</span>,
  FaPlus: () => <span data-testid="icon-plus">Plus</span>,
  FaRegEdit: () => <span data-testid="icon-edit">Edit</span>,
  FaTrashAlt: () => <span data-testid="icon-delete">Delete</span>
}));

jest.mock("react-icons/io5", () => ({
  IoClose: () => <span data-testid="icon-close">Close</span>,
  IoCloudUploadOutline: () => <span data-testid="icon-upload">Upload</span>,
  IoTrashOutline: () => <span data-testid="icon-trash-outline">Trash</span>
}));

describe('5.2.1 Frontend Mocking - ProductManager & Modal', () => {
  
  // Dữ liệu giả lậpa
  const mockProducts = [
    {
      _id: '1',
      title: 'iPhone 15 Pro',
      price: 25000000,
      category: 'Đồ điện tử',
      description: 'Titan tự nhiên',
      image: 'img.jpg',
      sizes: ['256GB', '512GB']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy alert và confirm
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true); // Luôn chọn OK
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- CASE 1: READ (Hiển thị danh sách) ---
  test('READ: Fetches and displays products successfully', async () => {
    // Setup Mock
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    render(<ProductManager />);

    // Kiểm tra loading ban đầu (nếu máy nhanh quá có thể skip)
    // expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument();

    // Verify API call
    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(1);
    });

    // Verify UI
    expect(await screen.findByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('Đồ điện tử')).toBeInTheDocument();
    
    // Kiểm tra giá tiền đã format (25.000.000 ₫)
    expect(screen.getByText(/25\.000\.000/)).toBeInTheDocument();
    
    // Kiểm tra hiển thị size tag
    expect(screen.getByText('256GB')).toBeInTheDocument();
  });

  // --- CASE 2: READ Empty (Không có sản phẩm) ---
  test('READ: Displays empty state when no products found', async () => {
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });

    render(<ProductManager />);

    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalled();
    });

    expect(await screen.findByText('Không có sản phẩm nào.')).toBeInTheDocument();
  });

  // --- CASE 3: CREATE (Thêm mới sản phẩm) ---
  test('CREATE: Opens modal, fills form and submits successfully', async () => {
    // 1. Setup Mock
    productRequest.getAllProducts.mockResolvedValue({ success: true, data: [] });
    productRequest.createProduct.mockResolvedValue({ success: true, data: {} });

    render(<ProductManager />);

    // 2. Click nút "Thêm sản phẩm"
    const addBtn = screen.getByRole('button', { name: /Thêm sản phẩm/i });
    fireEvent.click(addBtn);

    // 3. Kiểm tra Modal mở (Tìm title modal)
    expect(screen.getByText('Thêm sản phẩm mới')).toBeInTheDocument();

    // 4. Điền Form (Dựa trên placeholder trong code của bạn)
    const nameInput = screen.getByPlaceholderText('Ví dụ: Áo thun nam');
    const priceInput = screen.getByPlaceholderText('Ví dụ: 100000');
    const sizesInput = screen.getByPlaceholderText('Ví dụ: S, M, L, XL');
    // Select category (combobox)
    const categorySelect = screen.getByRole('combobox'); 

    fireEvent.change(nameInput, { target: { value: 'Áo Thun Test' } });
    fireEvent.change(priceInput, { target: { value: '50000' } });
    fireEvent.change(categorySelect, { target: { value: 'Thời trang' } });
    fireEvent.change(sizesInput, { target: { value: 'S, M, L' } });

    // 5. Submit Form (Nút "Thêm mới")
    const submitBtn = screen.getByText('Thêm mới');
    fireEvent.click(submitBtn);

    // 6. Verify Mock Call
    await waitFor(() => {
      expect(productRequest.createProduct).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Áo Thun Test',
        price: 50000, // Code bạn có ép kiểu Number()
        category: 'Thời trang',
        sizes: ['S', 'M', 'L'] // Code bạn có .split(',')
      }));
    });

    // 7. Verify Alert & Refresh
    expect(window.alert).toHaveBeenCalledWith("Thêm mới thành công!");
    expect(productRequest.getAllProducts).toHaveBeenCalledTimes(2); // 1 lần mount + 1 lần save
  });

  // --- CASE 4: UPDATE (Sửa sản phẩm) ---
  test('UPDATE: Opens modal with data and updates successfully', async () => {
    // 1. Setup: Load danh sách có 1 sản phẩm
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });
    // Setup: Update thành công
    productRequest.updateProduct.mockResolvedValue({ success: true });

    render(<ProductManager />);
    await screen.findByText('iPhone 15 Pro');

    // 2. Click nút Edit (Dựa vào mock icon)
    const editBtn = screen.getByTestId('icon-edit').closest('button');
    fireEvent.click(editBtn);

    // 3. Kiểm tra Modal mở với Title "Chỉnh sửa sản phẩm"
    expect(screen.getByText('Chỉnh sửa sản phẩm')).toBeInTheDocument();
    
    // Kiểm tra dữ liệu cũ đã load vào input
    expect(screen.getByDisplayValue('iPhone 15 Pro')).toBeInTheDocument();
    
    // 4. Sửa giá tiền
    const priceInput = screen.getByPlaceholderText('Ví dụ: 100000');
    fireEvent.change(priceInput, { target: { value: '26000000' } });

    // 5. Submit (Nút "Cập nhật")
    const updateSubmitBtn = screen.getByText('Cập nhật');
    fireEvent.click(updateSubmitBtn);

    // 6. Verify
    await waitFor(() => {
      expect(productRequest.updateProduct).toHaveBeenCalledWith(
        '1', // ID
        expect.objectContaining({
          title: 'iPhone 15 Pro',
          price: 26000000
        })
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Cập nhật thành công!");
  });

  // --- CASE 5: DELETE (Xóa sản phẩm) ---
  test('DELETE: Calls delete API and refreshes list', async () => {
    // 1. Setup
    productRequest.getAllProducts.mockResolvedValue({
      success: true,
      data: mockProducts
    });
    productRequest.deleteProduct.mockResolvedValue({ success: true });

    render(<ProductManager />);
    await screen.findByText('iPhone 15 Pro');

    // 2. Click nút Delete
    const deleteBtn = screen.getByTestId('icon-delete').closest('button');
    fireEvent.click(deleteBtn);

    // 3. Verify Confirm
    expect(window.confirm).toHaveBeenCalledWith("Bạn có chắc chắn muốn xóa sản phẩm này không?");

    // 4. Verify API Call
    expect(productRequest.deleteProduct).toHaveBeenCalledWith('1');

    // 5. Verify Refresh
    await waitFor(() => {
      expect(productRequest.getAllProducts).toHaveBeenCalledTimes(2);
    });

    expect(window.alert).toHaveBeenCalledWith("Đã xóa sản phẩm thành công!");
  });
});