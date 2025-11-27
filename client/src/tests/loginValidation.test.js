import { validateUsername, validatePassword } from '../utils/ValidationLogin';

// a) Unit tests cho validateUsername()
describe('Login Validation - validateUsername', () => {
  
  // 1. Test username rỗng
  test('should return error if username is empty', () => {
    expect(validateUsername('')).toBe("Vui lòng nhập tên đăng nhập.");
    expect(validateUsername(null)).toBe("Vui lòng nhập tên đăng nhập.");
    expect(validateUsername('   ')).toBe("Vui lòng nhập tên đăng nhập."); // Test trim()
  });

  // 2. Test username quá ngắn/dài
  test('should return error if username is too short (< 3 chars)', () => {
    expect(validateUsername('ab')).toBe("Tên đăng nhập phải từ 3 đến 50 ký tự.");
  });

  test('should return error if username is too long (> 50 chars)', () => {
    const longName = 'a'.repeat(51);
    expect(validateUsername(longName)).toBe("Tên đăng nhập phải từ 3 đến 50 ký tự.");
  });

  // 3. Test ký tự đặc biệt không hợp lệ
  test('should return error if username contains special characters', () => {
    expect(validateUsername('user@name')).toBe("Tên đăng nhập chỉ được chứa chữ, số và các dấu ( . - _ )");
    expect(validateUsername('user name')).toBe("Tên đăng nhập chỉ được chứa chữ, số và các dấu ( . - _ )"); // Có khoảng trắng
  });

  // 4. Test username hợp lệ
  test('should return empty string if username is valid', () => {
    expect(validateUsername('admin')).toBe("");
    expect(validateUsername('user.name-123')).toBe(""); // Test dấu chấm, gạch ngang
    expect(validateUsername('user_name')).toBe(""); // Test gạch dưới
  });
});

// b) Unit tests cho validatePassword()
describe('Login Validation - validatePassword', () => {

 
  test('should return error if password is empty', () => {
    expect(validatePassword('')).toBe("Vui lòng nhập mật khẩu.");
    expect(validatePassword(null)).toBe("Vui lòng nhập mật khẩu.");
  });

  // 2. Test password quá ngắn/dài
  test('should return error if password is too short (< 6 chars)', () => {
    expect(validatePassword('12345')).toBe("Mật khẩu phải từ 6 đến 100 ký tự.");
  });

  test('should return error if password is too long (> 100 chars)', () => {
    const longPass = 'a'.repeat(101);
    expect(validatePassword(longPass)).toBe("Mật khẩu phải từ 6 đến 100 ký tự.");
  });

  // 3. Test password không có chữ hoặc số

  test('should return error if password has no numbers', () => {
    expect(validatePassword('abcdef')).toBe("Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số.");
  });

  test('should return error if password has no letters', () => {
    expect(validatePassword('123456')).toBe("Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số.");
  });

  // 4. Test password hợp lệ

  test('should return empty string if password is valid', () => {
    expect(validatePassword('admin123')).toBe("");
    expect(validatePassword('Password@123')).toBe(""); 
  });
});