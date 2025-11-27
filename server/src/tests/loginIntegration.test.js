import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { loginUserMongo } from '../controllers/authController.js'; // Import Controller thật
import * as authService from '../services/authService.js'; // Import Service để Mock

// --- MOCKING ---
// 1. Mock AuthService: Giả lập logic nghiệp vụ để không cần DB thật
jest.mock('../services/authService.js');

// 2. Mock JWT Utils: Để trả về token cố định, dễ kiểm tra
jest.mock('../utils/jwt.js', () => ({
  generateToken: () => 'mock-jwt-token-123'
}));

// --- SETUP APP ---
// Tạo một ứng dụng Express thu nhỏ chỉ để test route login
const app = express();
app.use(cors()); // Middleware để test CORS (Yêu cầu c)
app.use(express.json()); // Middleware đọc JSON body
app.use(cookieParser()); // Middleware đọc/ghi cookie

// Gắn Controller vào Route
app.post('/api/auth/login', loginUserMongo);

describe('Integration Test: POST /api/auth/login', () => {

  // Reset toàn bộ mock trước mỗi test case để đảm bảo sạch sẽ
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Yêu cầu a) Test POST endpoint (3 điểm) ---
  
  // Scenario 1: Login thành công (Happy Path)
  test('Should return 200 OK and user data on success', async () => {
    // A. Setup Mock: Giả sử Service trả về user hợp lệ
    const mockUser = { 
      _id: 'user123', 
      username: 'testuser', 
      password: 'hashedpassword', // Giả sử service trả về user còn password (controller sẽ xóa nó)
      email: 'test@example.com' 
    };
    authService.authenticate.mockResolvedValue(mockUser);

    // B. Execute Request
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    // C. Verify (Kiểm tra)
    expect(res.statusCode).toBe(200);
    // Kiểm tra Controller có gọi Service với đúng tham số client gửi lên không
    expect(authService.authenticate).toHaveBeenCalledWith('testuser', 'password123');
  });

  // Scenario 2: Validation Error (Thiếu thông tin)
  test('Should return 400 Bad Request if username/password is missing', async () => {
    // Setup Mock: Giả sử Service ném lỗi validation
    // Lưu ý: Controller của bạn bắt lỗi dựa trên message cụ thể
    authService.authenticate.mockRejectedValue(new Error("Thiếu thông tin username hoặc password"));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: '' }); // Gửi thiếu password

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Thiếu thông tin" });
  });

  // Scenario 3: Login thất bại (Sai username hoặc password)
  test('Should return 401 Unauthorized if auth fails', async () => {
    // Setup Mock: Giả sử Service ném lỗi "Sai password"
    authService.authenticate.mockRejectedValue(new Error("Sai password"));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Sai username hoặc password" });
  });
  
  // Scenario 4: Lỗi Server không mong muốn (DB chết, code lỗi...)
  test('Should return 500 Internal Server Error on unexpected exceptions', async () => {
    // Setup Mock: Service ném lỗi lạ
    authService.authenticate.mockRejectedValue(new Error("Database connection failed"));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: "Lỗi server" });
  });

  // --- Yêu cầu b) Test response structure và status codes (1 điểm) ---
  test('Response should have correct structure (user object without password)', async () => {
    const mockUser = { _id: 'user123', username: 'cleanUser', password: 'secretPassword' };
    authService.authenticate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'cleanUser', password: '123' });

    // 1. Kiểm tra JSON trả về có key 'user'
    expect(res.body).toHaveProperty('user');
    // 2. Kiểm tra thông tin user khớp
    expect(res.body.user).toHaveProperty('username', 'cleanUser');
    // 3. Kiểm tra password ĐÃ BỊ XÓA (Logic quan trọng trong controller)
    expect(res.body.user).not.toHaveProperty('password');
    // 4. Kiểm tra Set-Cookie header tồn tại
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    // Kiểm tra cookie chứa token giả lập
    expect(cookies[0]).toMatch(/token=mock-jwt-token-123/);
    expect(cookies[0]).toMatch(/HttpOnly/); // Kiểm tra flag bảo mật
  });

  // --- Yêu cầu c) Test CORS và headers (1 điểm) ---
  test('Should support CORS and correct Content-Type', async () => {
    const mockUser = { _id: '123' };
    authService.authenticate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123' });

    // 1. Kiểm tra Content-Type phải là application/json
    expect(res.headers['content-type']).toMatch(/application\/json/);

    // 2. Kiểm tra CORS Headers (do dùng app.use(cors()))
    expect(res.headers['access-control-allow-origin']).toBe('*');
    
    // 3. Kiểm tra Pre-flight request (OPTIONS)
    const optionsRes = await request(app).options('/api/auth/login');
    expect(optionsRes.statusCode).toBe(204); // No Content
    expect(optionsRes.headers['access-control-allow-methods']).toBeDefined();
  });
});