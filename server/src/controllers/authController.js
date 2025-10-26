import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";



// Hàm xử lý đăng ký
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào DB
    const result = await UserModel.createUserdemo(username, hashedPassword);

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


//hàm xử lý đăng nhập
export const loginUser = async (req, res) => {
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Vui lòng nhập username và password" });
  }

  try {
    const rows = await UserModel.findByUsername(username);    

    if (rows.length === 0) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    const user = rows[0];

    // Nếu có hash bằng bcrypt:
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) return res.status(401).json({ message: "Sai username hoặc password" });

    // ✅ Không trả password về client
    delete user.password;

    const token = generateToken(user);

    // 🍪 Gửi token qua cookie
    res.cookie("token", token, {
      httpOnly: true,     // bảo mật: JS không đọc được
      secure: false,      // đặt true nếu chạy HTTPS
      sameSite: "Lax",    // tránh CSRF cơ bản
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    });

    console.log("Token:", req.cookies?.token);

    return res.json({
      user
    });

    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};


export const getCurrentUser = (req, res) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  return res.json({ user: req.user });
};
