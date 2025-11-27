// Đây là file ở phía React (Client), dùng fetch để gọi server
const API_URL = 'http://localhost:5000/api/products'; // Port server backend

// 1. Lấy danh sách sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json(); 
    // Backend trả về: { success: true, data: [...] }
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, data: [] };
  }
};

// 2. Tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) throw new Error('Create failed');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { success: false };
  }
};

// 3. Lấy chi tiết sản phẩm (nếu cần)
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Fetch detail failed');
    return await response.json();
  } catch (error) {
    return { success: false };
  }
};