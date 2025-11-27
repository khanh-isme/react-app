  import React from 'react';
  import { render, screen, fireEvent, waitFor } from '@testing-library/react';
  import { MemoryRouter } from 'react-router-dom';
  import Login from '../components/Login/Login'; 
  import { AuthContext } from '../redux/AuthContext'; 
  import * as authRequest from '../api/requests/auth'; 

  // --- MOCKING ---

  // 1. Tạo mockNavigate trước
const mockNavigate = jest.fn();

// 2. Mock react-router-dom
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});


  // 3. Mock Notification Component
  jest.mock('../components/Notification/Notification.js', () => { // SỬA: ../components
    return {
      Notification: ({ message }) => <div data-testid="notification">{message}</div>
    };
  });

  describe('Login Component Integration Tests', () => {
    let mockLoginContext;

    beforeEach(() => {
      // Reset mocks trước mỗi test case
      jest.clearAllMocks();
      mockLoginContext = jest.fn();
    });

    // Helper function để render component với Context và Router
    const renderLogin = () => {
      return render(
        <AuthContext.Provider value={{ login: mockLoginContext }}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </AuthContext.Provider>
      );
    };

    // --- a) Test rendering và user interactions (2 điểm) ---
    test('renders login form and updates inputs on user interaction', () => {
      renderLogin();

      // Kiểm tra các phần tử hiển thị
      const usernameInput = screen.getByPlaceholderText(/Email hoặc số điện thoại/i);
      const passwordInput = screen.getByPlaceholderText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      const registerLink = screen.getByText(/Tạo tài khoản mới/i);

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(registerLink).toBeInTheDocument();

      // Test tương tác nhập liệu (User Interaction)
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('password123');
    });

    // --- b) Test form submission và API calls (2 điểm) ---
    test('submits form, calls API, updates context, and navigates on success', async () => {
      // Setup Mock API trả về thành công
      const mockUser = { id: 1, username: 'testuser' };
      authRequest.loginUser.mockResolvedValue({ user: mockUser });

      renderLogin();

      // Điền form
      fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'password123' } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

      // Kiểm tra API được gọi với đúng tham số
      await waitFor(() => {
        expect(authRequest.loginUser).toHaveBeenCalledWith('testuser', 'password123');
      });

      // Kiểm tra Context login được gọi
      expect(mockLoginContext).toHaveBeenCalledWith(mockUser);

      // Kiểm tra điều hướng về trang chủ "/"
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // --- c) Test error handling và success messages (1 điểm) ---
    
    // Case 1: API trả về kết quả nhưng không có user (Lỗi logic từ server trả về)
    test('shows error message when login fails (API logic error)', async () => {
      // Setup Mock API trả về lỗi
      authRequest.loginUser.mockResolvedValue({ message: 'Sai tài khoản hoặc mật khẩu' });

      renderLogin();

      // Điền form và submit
      fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'wronguser' } });
      fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

      // Kiểm tra thông báo lỗi xuất hiện
      // Vì component dùng setTimeout nên cần waitFor
      await waitFor(() => {
        const notification = screen.getByTestId('notification');
        expect(notification).toHaveTextContent('Sai tài khoản hoặc mật khẩu');
      });

      // Đảm bảo không điều hướng và không update context
      expect(mockLoginContext).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Case 2: API ném ra lỗi (Network error / Exception)
    test('shows error message when API throws exception', async () => {
      // Setup Mock API ném lỗi
      authRequest.loginUser.mockRejectedValue(new Error('Lỗi kết nối server'));

      renderLogin();

      fireEvent.change(screen.getByPlaceholderText(/Email hoặc số điện thoại/i), { target: { value: 'user' } });
      fireEvent.change(screen.getByPlaceholderText(/Mật khẩu/i), { target: { value: 'pass' } });
      fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

      // Kiểm tra thông báo lỗi từ catch block
      await waitFor(() => {
        const notification = screen.getByTestId('notification');
        expect(notification).toHaveTextContent('Lỗi kết nối server');
      });
    });
  });