// Định nghĩa URL gốc cho Category API (chạy port 5000 giống product)
const API_URL = 'http://localhost:5000/api/categories';

// 1. Lấy danh sách tất cả danh mục
export const getAllCategories = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Backend trả về: { success: true, data: [...] }
    return await response.json(); 
  } catch (error) {
    console.error("Lỗi khi gọi API getAllCategories:", error);
    // Trả về cấu trúc mặc định để component không bị crash khi map()
    return { success: false, data: [] };
  }
};

// 2. Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gọi API createCategory:", error);
    return { success: false, message: error.message };
  }
};

// 3. Cập nhật danh mục
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gọi API updateCategory:", error);
    return { success: false };
  }
};

// 4. Xóa danh mục
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gọi API deleteCategory:", error);
    return { success: false };
  }
};