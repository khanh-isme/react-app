  import * as url from "../url";

/**
 * Hàm gọi API Hello
 * @returns {Promise<string>} message từ server
 */
export const Hello = async () => {
  try {
    const res = await fetch(url.Hello, {
      method: "GET",             // rõ ràng method
      credentials: "include"     // nếu cần gửi cookie/session
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.message;       // trả về dữ liệu cho component dùng
  } catch (err) {
    console.error("Lỗi API:", err);
    throw err; // quăng lỗi để component bên ngoài xử lý tiếp
  }
};

