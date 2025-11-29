import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Import Component cần test
import Login from '../pages/Login/Login'; 
// Import Context
import { AuthContext } from '../redux/AuthContext';
// Import file Service thật để lấy đối tượng mock
import * as authService from '../api/requests/auth';

// --- YÊU CẦU a) Mock authService.loginUser() (1 điểm) ---
// Mock toàn bộ module api/requests/auth
jest.mock('../api/requests/auth');

// --- MOCK REACT ROUTER DOM ---
// Vì component có dùng useNavigate và Link, ta phải mock chúng để không bị lỗi.
// Tuy nhiên, ta mock dạng "dummy" (giả) hoàn toàn để không cần phụ thuộc thư viện thật.
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  // useNavigate chỉ cần trả về một hàm mock là đủ để component gọi không lỗi
  useNavigate: () => mockNavigate,
  // Link chỉ cần render ra thẻ a hoặc span để hiển thị text bên trong
  Link: ({ children }) => <a href="#">{children}</a>
}));

// Mock Notification để tránh lỗi render component con
jest.mock('../components/Notification/Notification', () => ({
  Notification: () => <div data-testid="notification" />
}));

describe('5.1.1 Frontend Mocking - Login Component', () => {
  let mockLoginContext;

  beforeEach(() => {
    jest.clearAllMocks(); // Xóa lịch sử gọi hàm trước mỗi test case
    mockLoginContext = jest.fn();
  });

  const renderLogin = () => {
    render(
      <AuthContext.Provider value={{ login: mockLoginContext }}>
        <Login />
      </AuthContext.Provider>
    );
  };

  // --- YÊU CẦU b) Test với mocked successful responses (1 điểm) ---
  test('Scenario: Successful Login - Mocks return user object', async () => {
    // 1. Setup Mock: Giả lập loginUser trả về thành công
    const mockUser = { id: 1, username: 'mockUser' };
    authService.loginUser.mockResolvedValue({ user: mockUser });

    renderLogin();

    // 2. User Interaction: Nhập liệu và Submit
    fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    // --- YÊU CẦU c) Verify mock calls (0.5 điểm) ---
    await waitFor(() => {
      // Kiểm tra xem hàm giả (mock) đã được component gọi chưa
      expect(authService.loginUser).toHaveBeenCalledTimes(1);
      // Kiểm tra xem tham số truyền vào hàm giả có đúng với input không
      expect(authService.loginUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    // Kiểm tra logic sau khi thành công
    expect(mockLoginContext).toHaveBeenCalledWith(mockUser);
    
    // Kiểm tra navigate có được gọi không (dù là hàm giả)
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // --- YÊU CẦU b) Test với mocked failed responses (1 điểm) ---
  test('Scenario: Failed Login - Mocks return error message', async () => {
    // 1. Setup Mock: Giả lập loginUser trả về thất bại (Logic API trả về object lỗi)
    authService.loginUser.mockResolvedValue({ message: 'Sai mật khẩu' });

    renderLogin();

    // 2. User Interaction
    fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    // --- YÊU CẦU c) Verify mock calls (0.5 điểm) ---
    await waitFor(() => {
      // Vẫn phải đảm bảo hàm được gọi, dù kết quả là sai
      expect(authService.loginUser).toHaveBeenCalledWith('wronguser', 'wrongpass');
    });

    // Kiểm tra logic xử lý lỗi: Không được gọi context login
    expect(mockLoginContext).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('Scenario: API Exception - Mocks network error', async () => {
    // 1. Setup Mock: Giả lập lỗi mạng (Exception)
    authService.loginUser.mockRejectedValue(new Error('Lỗi kết nối'));

    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalled();
    });
    
    // Đảm bảo app không crash và không login
    expect(mockLoginContext).not.toHaveBeenCalled();
  });
});