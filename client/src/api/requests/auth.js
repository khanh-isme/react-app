import * as url from "../url";
/**
 * @returns {Promise<string>} message từ server
 */

import { Notification } from "../../components/Notification/Notification";
export const registerUser = async (formData) => {
  try {
    const res = await fetch(url.Register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),             // rõ ràng method
      credentials: "include"     // nếu cần gửi cookie/session
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Lỗi API:", err);
    throw err; 
  }
};

export const loginUser = async (username,password) =>{
  try{
    const res = await fetch(url.Login,{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          username:username,
          password:password,
        }
      ),
      credentials: "include" 
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP ${res.status}`);
    }
    const result = await res.json();
    return result;


  }catch (err) {
    throw err; // quăng lỗi để component bên ngoài xử lý tiếp
  }

}

