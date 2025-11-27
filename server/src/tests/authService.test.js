import { authenticate, validateLoginInput } from '../services/authService';
import {User} from '../models/user.model';
import bcrypt from 'bcrypt';

// Mock các dependency
jest.mock('../models/user.model');
jest.mock('bcrypt');

describe('AuthService', () => {
  
  // Reset mock sau mỗi test case
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- PHẦN B: Test validation methods riêng lẻ (1 điểm) ---
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

  // --- PHẦN A: Test method authenticate() (3 điểm) ---
  describe('authenticate', () => {
    
    // 1. Scenario: Validation errors
    test('should throw error if validation fails', async () => {
      await expect(authenticate('', ''))
        .rejects
        .toThrow("Thiếu thông tin username hoặc password");
    });

    // 2. Scenario: Login với username không tồn tại
    test('should throw error if user does not exist', async () => {
      // Giả lập DB trả về null
      User.findOne.mockResolvedValue(null);

      await expect(authenticate('wrongUser', '123'))
        .rejects
        .toThrow("Username không tồn tại");
    });

    // 3. Scenario: Login với password sai
    test('should throw error if password is incorrect', async () => {
      // Giả lập tìm thấy user
      const mockUser = { username: 'admin', password: 'hashedPass' };
      User.findOne.mockResolvedValue(mockUser);
      
      // Giả lập bcrypt so sánh ra false
      bcrypt.compare.mockResolvedValue(false);

      await expect(authenticate('admin', 'wrongPass'))
        .rejects
        .toThrow("Sai password");
    });

    // 4. Scenario: Login thành công
    test('should return user object if login succeeds', async () => {
      // Giả lập tìm thấy user
      const mockUser = { username: 'admin', password: 'hashedPass', _id: '123' };
      User.findOne.mockResolvedValue(mockUser);
      
      // Giả lập bcrypt so sánh ra true
      bcrypt.compare.mockResolvedValue(true);

      const result = await authenticate('admin', 'correctPass');
      
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ username: 'admin' });
    });
  });
});