// Import biến url chung nếu bạn có file config (tùy chọn)
import * as url from "../url";

const API_URL = 'http://localhost:5000/api/categories';

// 1. READ ALL: Lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Lỗi kết nối: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về object { success: true, data: [...] }
  } catch (error) {
    console.error("Lỗi khi gọi API getAllCategories:", error);
    return null;
  }
};

// 2. READ ONE: Lấy chi tiết 1 danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy chi tiết danh mục: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getCategoryById:", error);
    return null;
  }
};

// 3. CREATE: Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Bắt buộc
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo danh mục: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API createCategory:", error);
    return null;
  }
};

// 4. UPDATE: Cập nhật danh mục theo ID
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Bắt buộc
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi cập nhật danh mục: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API updateCategory:", error);
    return null;
  }
};

// 5. DELETE: Xóa danh mục theo ID
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi xóa danh mục: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API deleteCategory:", error);
    return null;
  }
};