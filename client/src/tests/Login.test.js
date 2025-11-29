import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';  
import Login from '../pages/Login/Login';
import { AuthContext } from '../redux/AuthContext';
import * as authRequest from '../api/requests/auth';

// --- MOCKS ---

// 1. Mock useNavigate TRƯỚC
const mockNavigate = jest.fn();

// 2. MOCK react-router-dom ĐÚNG CHUẨN
jest.mock('react-router-dom', () => ({
  // useNavigate chỉ cần trả về một hàm mock là đủ để component gọi không lỗi
  useNavigate: () => mockNavigate,
  // Link chỉ cần render ra thẻ a hoặc span để hiển thị text bên trong
  Link: ({ children }) => <a href="#">{children}</a>
}));

// 3. Mock Component Notification
jest.mock('../components/Notification/Notification.js', () => ({
  Notification: ({ message }) => <div data-testid="notification">{message}</div>
}));

// 4. Mock API loginUser
jest.mock('../api/requests/auth', () => ({
  loginUser: jest.fn()
}));


// ---------------- TESTS ----------------
describe('Login Component Integration Tests', () => {
  let mockLoginContext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginContext = jest.fn();
  });

  // Helper render function
  const renderLogin = () => {
    return render(
      <AuthContext.Provider value={{ login: mockLoginContext }}>      
          <Login />
      </AuthContext.Provider>
    );
  };

  // --- a) Test giao diện + interaction ---
  test('renders login form and updates inputs on user interaction', () => {
    renderLogin();

    const usernameInput = screen.getByPlaceholderText(/Email hoặc số điện thoại/i);
    const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    const registerLink = screen.getByText(/Tạo tài khoản mới/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  // --- b) Test submit form, API call, context, navigate ---
  test('submits form, calls API, updates context, and navigates on success', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    authRequest.loginUser.mockResolvedValue({ user: mockUser });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => {
      expect(authRequest.loginUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    expect(mockLoginContext).toHaveBeenCalledWith(mockUser);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // --- c1) API trả về lỗi logic ---
  test('shows error message when login fails (API logic error)', async () => {
    authRequest.loginUser.mockResolvedValue({ message: 'Sai tài khoản hoặc mật khẩu' });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => {
      const notification = screen.getByTestId('notification');
      expect(notification).toHaveTextContent('Sai tài khoản hoặc mật khẩu');
    });

    expect(mockLoginContext).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // --- c2) API throw exception ---
  test('shows error message when API throws exception', async () => {
    authRequest.loginUser.mockRejectedValue(new Error('Lỗi kết nối server'));

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => {
      const notification = screen.getByTestId('notification');
      expect(notification).toHaveTextContent('Lỗi kết nối server');
    });
  });
});
