import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaRegEdit, FaTrashAlt } from "react-icons/fa";
// Import các hàm API từ service
import { getAllProducts, deleteProduct } from '../../api/requests/product'; 
// Import Component Modal Form
import ProductFormModal from './ProductFormModal';
import './ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- State quản lý Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Hàm format tiền tệ
  const formatMoney = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      if (res && res.success) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const res = await deleteProduct(id);
      if (res && res.success) {
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        alert("Xóa thất bại: " + (res?.message || "Lỗi không xác định"));
      }
    }
  };

  // --- Handlers cho Modal ---
  
  // Mở modal thêm mới
  const handleCreate = () => {
    setEditingProduct(null); // Reset data để form trống
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (product) => {
    setEditingProduct(product); // Truyền data sản phẩm vào form
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="pm-container">
      {/* Hiển thị Modal Overlay */}
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={fetchProducts} // Load lại danh sách sau khi lưu thành công
        productToEdit={editingProduct}
      />

      <div className="pm-header">
        <div className="pm-header-left">
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        {/* Gắn sự kiện mở modal thêm mới */}
        <button className="pm-add-btn" onClick={handleCreate}>
          <FaPlus style={{ marginRight: '8px' }} />
          Thêm sản phẩm
        </button>
      </div>

      <div className="pm-search-container">
        <FaSearch className="pm-search-icon" />
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..." 
          className="pm-search-input"
        />
      </div>

      <div className="pm-table-wrapper">
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
        ) : (
          <table className="pm-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Hình ảnh</th>
                <th style={{ width: '30%' }}>Tên sản phẩm</th>
                <th style={{ width: '15%' }}>Danh mục</th>
                <th style={{ width: '15%' }}>Giá</th>
                <th style={{ width: '20%' }}>Sizes</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image || ""} 
                        alt={product.title} 
                        className="pm-product-img" 
                        onError={(e) => {e.target.onerror = null; e.target.src=""}}
                      />
                    </td>
                    <td>
                      <div className="pm-product-info">
                        <span className="pm-product-name">{product.title}</span>
                        <span className="pm-product-desc">{product.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`pm-badge pm-badge-blue`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="pm-price-text">{formatMoney(product.price)}</td>
                    <td>
                      <div className="pm-size-list">
                        {product.sizes && product.sizes.length > 0 ? (
                          product.sizes.map((size, index) => (
                            <span key={index} className="pm-size-tag">{size}</span>
                          ))
                        ) : (
                          <span className="pm-size-tag">Free Size</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="pm-actions">
                        {/* Gắn sự kiện mở modal chỉnh sửa */}
                        <button 
                          className="pm-action-btn edit" 
                          onClick={() => handleEdit(product)}
                        >
                          <FaRegEdit />
                        </button>
                        <button 
                          className="pm-action-btn delete" 
                          onClick={() => handleDelete(product._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductManager;