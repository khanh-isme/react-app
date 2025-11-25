import bcrypt from "bcrypt";
import {getUserByName,createUser} from "../database/user.repository.js"
import { generateToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";


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


export const loginUserMongo = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu thông tin" });
  }

  try {
    const user = await getUserByName(username); // ✅ object hoặc null

    if (!user) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai username hoặc password" });
    }

    delete user.password;

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 86400000
    });

    return res.json({ user });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
