import {User} from '../models/user.model.js'; 
import bcrypt from 'bcrypt';

export const validateLoginInput = (username, password) => {
  if (!username || !password) {
    return { valid: false, message: "Thiếu thông tin username hoặc password" };
  }
  return { valid: true };
};


export const authenticate = async (username, password) => {
  
  const validation = validateLoginInput(username, password);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const user = await User.findOne({ name:username });
  
  if (!user) {
    throw new Error("Username không tồn tại");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Sai password");
  }

  return user;
};