


import * as url from "../url";
const API_URL = 'http://localhost:5000/api/products';

// 1. READ ALL: Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Lỗi kết nối: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Lỗi khi gọi API getAllProducts:", error);
    return null;
  }
};

// 2. READ ONE: Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Lỗi khi lấy chi tiết sản phẩm: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getProductById:", error);
    return null;
  }
};

// 3. CREATE: Thêm sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // BẮT BUỘC phải có dòng này
      },
      body: JSON.stringify(productData), // Chuyển object JS thành chuỗi JSON
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo sản phẩm: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API createProduct:", error);
    return null;
  }
};

// 4. UPDATE: Cập nhật sản phẩm theo ID
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT', // Hoặc 'PATCH' tùy backend, nhưng code trước mình dùng PUT
      headers: {
        'Content-Type': 'application/json', // BẮT BUỘC
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi cập nhật sản phẩm: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API updateProduct:", error);
    return null;
  }
};

// 5. DELETE: Xóa sản phẩm theo ID
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API deleteProduct:", error);
    return null;
  }
};