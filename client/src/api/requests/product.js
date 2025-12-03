// Nếu file "../url" của bạn có export const BASE_URL = "http://localhost:5000/api";
// thì hãy dùng nó. Nếu chưa, cứ giữ hardcode để test cho dễ trước.

const API_URL = 'http://localhost:5000/api/products';

// 1. READ ALL: Lấy sản phẩm (Đã nâng cấp hỗ trợ Phân trang)
// Mặc định lấy trang 1, 10 sản phẩm
export const getAllProducts = async (page = 1, limit = 40) => {
  try {
    // Thêm query param vào URL: ?page=1&limit=10
    const url = `${API_URL}?page=${page}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Lỗi kết nối: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // data lúc này sẽ là: { products: [...], total: 20, totalPages: 2, ... }
    return data; 
  } catch (error) {
    console.error("Lỗi khi gọi API getAllProducts:", error);
    // Trả về null hoặc object rỗng để frontend không bị crash khi map
    return null;
  }
};

// 2. READ ONE: Lấy chi tiết
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Lỗi get detail: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi getProductById:", error);
    return null;
  }
};

// 3. CREATE
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
        // Cố gắng đọc lỗi từ backend trả về (vd: "Thiếu tên sản phẩm")
        const errorData = await response.json(); 
        throw new Error(errorData.message || `Lỗi tạo: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi createProduct:", error);
    return null;
  }
};

// 4. UPDATE
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || `Lỗi update: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi updateProduct:", error);
    return null;
  }
};

// 5. DELETE
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Lỗi delete: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi deleteProduct:", error);
    return null;
  }
};