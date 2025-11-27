import bcrypt from "bcrypt";
import {getUserByName,createUser} from "../database/user.repository.js"
import { generateToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";
import {authenticate} from "../services/authService.js"



export const loginUserMongo = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Gọi Service để xử lý logic xác thực
    // Nếu sai pass hoặc user không tồn tại, service sẽ throw Error
    const user = await authenticate(username, password);

    // 2. Controller chỉ lo phần HTTP: Xóa password khỏi response & Tạo Token
    if (user.password) {
        // Nếu user là Mongoose Document, cần chuyển sang object thường để delete
        // user = user.toObject(); 
        user.password = undefined; // Hoặc dùng delete user.password
    }

    const token = generateToken(user);

    // 3. Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set true nếu chạy HTTPS
      sameSite: "Lax",
      maxAge: 86400000 // 1 ngày
    });

    // 4. Trả về kết quả
    return res.status(200).json({ user });

  } catch (err) {
    console.error("Login error:", err.message);

    // 5. Xử lý lỗi từ Service ném ra để trả về Status Code phù hợp
    
    // Lỗi validation đầu vào
    if (err.message === "Thiếu thông tin username hoặc password") {
        return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Lỗi đăng nhập thất bại (Security: Nên trả về thông báo chung chung)
    if (err.message === "Username không tồn tại" || err.message === "Sai password") {
        return res.status(401).json({ message: "Sai username hoặc password" });
    }

    // Các lỗi không xác định khác
    return res.status(500).json({ message: "Lỗi server" });
  }
};











export const register = async (req, res) => {
  try {
    
    const { name, password  } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const exist = await getUserByName(name);
    if (exist) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log(hashed);

    const user = await createUser({
      name: name,
      password: hashed,
      avatarUrl: ""
    });

    res.status(201).json({
      message: "✅ Đăng ký thành công",
      user: {
        id: user._id,
        name: user.name,
      }
    });
  } catch (err) {
    console.error("❌ Đăng ký lỗi:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};



//hàm xử lý đăng nhập

export const getCurrentUser =  async(req, res) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};



