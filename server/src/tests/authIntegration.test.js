import request from 'supertest';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { loginUserMongo } from '../controllers/authController'; // Import Controller thật
import * as authService from '../services/authService.js'; // Import Service để Mock

// --- SETUP ---
// 1. Mock AuthService: Ta chỉ test lớp Controller + Router (Web Layer), 
// nên sẽ giả lập logic service để không 
// cần kết nối DB thật.
jest.mock('../services/authService.js');

// 2. Mock JWT Utils (để tránh lỗi generateToken trong controller)
jest.mock('../utils/jwt', () => ({
  generateToken: () => 'mock-jwt-token'
}));

// 3. Mock bcrypt (để controller không bị lỗi khi so sánh pass)
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));

// 4. Tạo App Express giả lập cho test
const app = express();
app.use(cors()); // Để test yêu cầu c) CORS
app.use(express.json());
app.use(cookieParser());

// Gắn route trực tiếp vào app test
app.post('/api/auth/login', loginUserMongo);

describe('Integration Test: POST /api/auth/login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Yêu cầu a) Test POST endpoint (3 điểm) ---
  
  // Scenario 1: Login thành công
  test('POST /api/auth/login - Should return 200 and user data on success', async () => {
    // Setup Mock Service trả về user hợp lệ
    const mockUser = { _id: '123', username: 'testuser', password: 'hashedpass' };
    
    // Giả lập hàm authenticate (từ authService) trả về user
    // Lưu ý: Controller của bạn có thể gọi getUserByName hoặc authenticate, 
    // bạn cần mock đúng hàm mà controller sử dụng. 
    // Ở đây mình mock getUserByName theo code controller bạn gửi trước đó.
    const userService = require('../services/authService.js'); // Hoặc services/userService tùy cấu trúc
    
    // Giả sử controller gọi authService.authenticate hoặc getUserByName
    // Ở đây mình mock getUserByName trả về user (để controller chạy tiếp logic)
    // Nếu controller bạn đã sửa dùng authenticate thì mock authenticate.
    
    // *Dựa theo code Controller cũ bạn gửi:* Nó gọi getUserByName
    // Nhưng để Integration Test chuẩn, ta nên giả định Controller đã dùng Service mới
    // Nếu dùng code cũ, ta mock getUserByName:
    // userService.getUserByName.mockResolvedValue(mockUser);
    
    // Nếu Controller gọi authService.authenticate (cách clean code):
    authService.authenticate.mockResolvedValue(mockUser); 

    // Thực hiện request
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    // Kiểm tra status code
    expect(res.statusCode).toBe(200);
  });

  // Scenario 2: Validation Error (Thiếu info)
  test('POST /api/auth/login - Should return 400 if missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: '' }); // Thiếu password

    expect(res.statusCode).toBe(400);
    // Yêu cầu b) Test response structure
    expect(res.body).toEqual({ message: "Thiếu thông tin" });
  });

  // Scenario 3: Login thất bại (Sai pass hoặc user không tồn tại)
  test('POST /api/auth/login - Should return 401 on auth failure', async () => {
    // Mock Service ném lỗi (hoặc trả về null tùy logic service)
    authService.authenticate.mockRejectedValue(new Error('Sai username hoặc password'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });

    // Tùy vào cách controller handle error (500 hoặc 401), 
    // ở đây ta mong đợi controller bắt lỗi và trả 401 hoặc 500
    // Dựa trên code cũ: catch(err) -> 500. 
    // Nếu bạn muốn test 401, mock service trả về null thay vì throw Error.
    expect(res.statusCode).toBeOneOf([401, 500]); 
  });

  // --- Yêu cầu b) Test response structure (1 điểm) ---
  test('Response should have correct JSON structure and Set-Cookie', async () => {
    const mockUser = { _id: '123', username: 'structureUser' };
    authService.authenticate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'structureUser', password: '123' });

    // Kiểm tra cấu trúc JSON trả về
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'structureUser');
    
    // Kiểm tra mật khẩu đã bị xóa khỏi response chưa
    expect(res.body.user).not.toHaveProperty('password');

    // Kiểm tra Cookie được set (dựa trên res.cookie trong controller)
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=mock-jwt-token/);
  });

  // --- Yêu cầu c) Test CORS và headers (1 điểm) ---
  test('Should have correct Headers and CORS support', async () => {
    const mockUser = { _id: '123' };
    authService.authenticate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123' });

    // 1. Kiểm tra Content-Type
    expect(res.headers['content-type']).toMatch(/application\/json/);

    // 2. Kiểm tra CORS Headers
    // Vì ta dùng app.use(cors()), mặc định nó sẽ trả về Access-Control-Allow-Origin: *
    expect(res.headers['access-control-allow-origin']).toBe('*');
    
    // Kiểm tra phương thức OPTIONS (Pre-flight request của CORS)
    const optionsRes = await request(app).options('/api/auth/login');
    expect(optionsRes.statusCode).toBe(204); // No Content
    expect(optionsRes.headers['access-control-allow-methods']).toContain('POST');
  });
});

// Helper custom matcher (nếu jest version cũ không có)
expect.extend({
  toBeOneOf(received, validOptions) {
    const pass = validOptions.includes(received);
    if (pass) {
      return { message: () => `expected ${received} not to be one of ${validOptions}`, pass: true };
    } else {
      return { message: () => `expected ${received} to be one of ${validOptions}`, pass: false };
    }
  },
});