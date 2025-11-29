import { loginUserMongo } from '../controllers/authController';
import * as authService from '../services/authService'; // Dependency cần mock
import * as jwtUtils from '../utils/jwt'; // Dependency cần mock

// Mock Service và JWT
jest.mock('../services/authService');
jest.mock('../utils/jwt');

describe('AuthController - Backend Mocking', () => {
  let req, res;
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console.error để tránh in lỗi đỏ ra terminal khi chạy test catch block
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup Req/Res giả
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(), // Để chain được .status().json()
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // --- Scenario 1: Đăng nhập thành công ---
  test('should return 200, set cookie and return user on success', async () => {
    // 1. Setup Mock
    req.body = { username: 'testuser', password: 'password123' };
    
    const mockUser = { _id: '1', name: 'testuser', password: 'hashedPass' };
    authService.authenticate.mockResolvedValue(mockUser); // Service trả về user
    
    const mockToken = 'fake-jwt-token';
    jwtUtils.generateToken.mockReturnValue(mockToken); // Mock JWT

    // 2. Execute
    await loginUserMongo(req, res);

    // 3. Verify
    // Kiểm tra Service được gọi đúng tham số
    expect(authService.authenticate).toHaveBeenCalledWith('testuser', 'password123');

    // Kiểm tra Cookie
    expect(res.cookie).toHaveBeenCalledWith('token', mockToken, expect.any(Object));

    // Kiểm tra Response Status và JSON
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Kiểm tra password đã bị xóa chưa (Logic trong controller: user.password = undefined)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.not.objectContaining({ password: expect.anything() })
    }));
  });

  // --- Scenario 2: Lỗi Validation tại Controller (Thiếu thông tin) ---
  test('should return 400 if username or password is missing (Controller Validation)', async () => {
    // Setup: Thiếu password
    req.body = { username: 'user' }; 

    // Execute
    await loginUserMongo(req, res);

    // Verify
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Thiếu thông tin" });
    
    // QUAN TRỌNG: Do Controller check validate trước, nên Service KHÔNG được gọi
    expect(authService.authenticate).not.toHaveBeenCalled();
  });

  // --- Scenario 3: Đăng nhập thất bại (Service ném lỗi) ---
  test('should return 401 if service throws "Sai password" or "Username không tồn tại"', async () => {
    req.body = { username: 'wrong', password: 'wrong' };
    
    // Mock Service ném lỗi "Sai password"
    const error = new Error("Sai password");
    authService.authenticate.mockRejectedValue(error);

    await loginUserMongo(req, res);

    expect(authService.authenticate).toHaveBeenCalledWith('wrong', 'wrong');
    expect(res.status).toHaveBeenCalledWith(401);
    // Controller map lỗi này thành message chung:
    expect(res.json).toHaveBeenCalledWith({ message: "Sai username hoặc password" });
  });

  // --- Scenario 4: Lỗi Server không xác định ---
  test('should return 500 for unknown errors', async () => {
    req.body = { username: 'user', password: 'pass' };
    
    // Mock Service ném lỗi lạ (ví dụ lỗi DB connection)
    const error = new Error("Database connection failed");
    authService.authenticate.mockRejectedValue(error);

    await loginUserMongo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Lỗi server" });
  });
});