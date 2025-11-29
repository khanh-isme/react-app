import { loginUserMongo } from '../controllers/authController'; // Controller cần test
import * as authService from '../services/authService'; // Dependency cần mock
import * as jwtUtils from '../utils/jwt'; // Dependency cần mock

// --- YÊU CẦU a) Mock AuthService (Tương đương @MockBean) (1 điểm) ---
jest.mock('../services/authService');
jest.mock('../utils/jwt');

describe('5.1.2 Backend Mocking - AuthController', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup Req/Res giả (Mock Objects)
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(), // Để chain được .status().json()
      json: jest.fn(),
      cookie: jest.fn()
    };
  });

  // --- YÊU CẦU b) Test controller với mocked service (1 điểm) ---
  
  test('Scenario: Successful Login - Controller should return 200 and set cookie', async () => {
    // 1. Setup Mock Behavior
    req.body = { username: 'testuser', password: 'password123' };
    
    const mockUser = { _id: '1', username: 'testuser', password: 'hashedPass' };
    authService.authenticate.mockResolvedValue(mockUser); // Mock service trả về user
    
    const mockToken = 'fake-token';
    jwtUtils.generateToken.mockReturnValue(mockToken); // Mock JWT

    // 2. Execute Controller Action (Gọi hàm trực tiếp)
    await loginUserMongo(req, res);

    // --- YÊU CẦU c) Verify mock interactions (0.5 điểm) ---
    
    // Verify Service Interaction: Service có được gọi đúng tham số không?
    expect(authService.authenticate).toHaveBeenCalledTimes(1);
    expect(authService.authenticate).toHaveBeenCalledWith('testuser', 'password123');

    // Verify JWT Interaction
    expect(jwtUtils.generateToken).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser' }));

    // Verify Response: Cookie có được set không?
    expect(res.cookie).toHaveBeenCalledWith('token', mockToken, expect.any(Object));

    // Verify Response: JSON trả về có đúng status 200 không?
    expect(res.status).toHaveBeenCalledWith(200);
    // Password phải bị xóa khỏi response
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.not.objectContaining({ password: expect.anything() })
    }));
  });

  test('Scenario: Failed Login - Controller should return 401 on Service Error', async () => {
    // 1. Setup Mock
    req.body = { username: 'wrong', password: 'wrong' };
    
    // Mock service ném lỗi "Sai password"
    const error = new Error("Sai password");
    authService.authenticate.mockRejectedValue(error);

    // 2. Execute
    await loginUserMongo(req, res);

    // 3. Verify Interaction (Yêu cầu c)
    expect(authService.authenticate).toHaveBeenCalledWith('wrong', 'wrong');

    // Verify Response
    expect(res.status).toHaveBeenCalledWith(401);
    // SỬA LỖI 1: Cập nhật message kỳ vọng khớp với controller ("Sai username hoặc password")
    expect(res.json).toHaveBeenCalledWith({ message: "Sai username hoặc password" });
    
    // Đảm bảo không tạo token
    expect(jwtUtils.generateToken).not.toHaveBeenCalled();
  });

  test('Scenario: Validation Error - Controller should return 400 if missing fields', async () => {
    // 1. Setup Mock: Thiếu password
    req.body = { username: 'user' }; // password undefined

    // SỬA LỖI 2: Mock Service ném lỗi validation (Vì controller gọi service ngay dòng đầu)
    const error = new Error("Thiếu thông tin username hoặc password");
    authService.authenticate.mockRejectedValue(error);

    // 2. Execute
    await loginUserMongo(req, res);

    // 3. Verify
    // Controller MỚI gọi service với tham số (username, undefined)
    expect(authService.authenticate).toHaveBeenCalledWith('user', undefined);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Thiếu thông tin" });
  });
});