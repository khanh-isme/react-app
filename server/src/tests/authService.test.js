import { authenticate, validateLoginInput } from '../services/authService';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

// Mock các dependency
jest.mock('../models/user.model');
jest.mock('bcrypt');

describe('AuthService', () => {
  
  // Reset mock sau mỗi test case
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Test Validation Function ---
  describe('validateLoginInput', () => {
    test('should return invalid if inputs are empty', () => {
      const result = validateLoginInput('', '');
      expect(result.valid).toBe(false);
      expect(result.message).toBe("Thiếu thông tin username hoặc password");
    });

    test('should return valid if inputs are provided', () => {
      const result = validateLoginInput('user', 'pass');
      expect(result.valid).toBe(true);
    });
  });

  // --- Test Authenticate Function ---
  describe('authenticate', () => {
    
    // Case 1: Lỗi Validation
    test('should throw error if validation fails', async () => {
      await expect(authenticate('', ''))
        .rejects
        .toThrow("Thiếu thông tin username hoặc password");
    });

    // Case 2: User không tồn tại
    test('should throw error if user does not exist', async () => {
      // Giả lập DB trả về null
      User.findOne.mockResolvedValue(null);

      await expect(authenticate('wrongUser', '123'))
        .rejects
        .toThrow("Username không tồn tại");

      // QUAN TRỌNG: Code của bạn đang tìm theo key "name", không phải "username"
      expect(User.findOne).toHaveBeenCalledWith({ name: 'wrongUser' });
    });

    // Case 3: Sai password
    test('should throw error if password is incorrect', async () => {
      // Giả lập tìm thấy user
      const mockUser = { name: 'admin', password: 'hashedPass' };
      User.findOne.mockResolvedValue(mockUser);
      
      // Giả lập bcrypt so sánh ra false
      bcrypt.compare.mockResolvedValue(false);

      await expect(authenticate('admin', 'wrongPass'))
        .rejects
        .toThrow("Sai password");
    });

    // Case 4: Đăng nhập thành công
    test('should return user object if login succeeds', async () => {
      // Giả lập tìm thấy user
      const mockUser = { name: 'admin', password: 'hashedPass', _id: '123' };
      User.findOne.mockResolvedValue(mockUser);
      
      // Giả lập bcrypt so sánh ra true
      bcrypt.compare.mockResolvedValue(true);

      const result = await authenticate('admin', 'correctPass');
      
      expect(result).toEqual(mockUser);
      // Kiểm tra xem logic tìm kiếm có đúng với code implementation không
      expect(User.findOne).toHaveBeenCalledWith({ name: 'admin' });
    });
  });
});