import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa"; 
import './ProductCard.css';
import ProductDetailModal from './ProductDetailModal';

const ProductForm = ({ _id, image, category, title, description, price, sizes }) => {

  const [showProductDetail, setShowProductDetail] = useState(false);

  // Hàm format tiền tệ để hiển thị UI (chỉ dùng hiển thị)
  const formatMoney = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Đóng gói object data
  const productData = { 
    _id,
    image, 
    category, 
    title, 
    description, 
    price, // Vẫn giữ là Number để Modal tính toán
    sizes: sizes && sizes.length > 0 ? sizes : [38, 39, 40, 41] // fallback nếu rỗng
  };

  return (
    <>
      {/* Modal */}
      {showProductDetail && (
        <ProductDetailModal 
            product={productData}
            onClose={() => setShowProductDetail(false)}
        />
      )}

      {/* Card */}
      <div 
        className="product-card"
        onClick={() => setShowProductDetail(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="product-image-container">
          {/* Fallback ảnh nếu link lỗi */}
          <img 
            src={image || "https://via.placeholder.com/300"} 
            alt={title} 
            className="product-image" 
          />
        </div>

        <div className="product-content">
          <span className="product-category">{category || "Sản phẩm"}</span>
          <h3 className="product-title">{title}</h3>
          
          {/* Cắt ngắn description nếu quá dài */}
          <p className="product-description">
            {description?.length > 50 ? description.substring(0, 50) + "..." : description}
          </p>

          <div className="product-footer">
            {/* Hiển thị giá đã format */}
            <span className="product-price">{formatMoney(price)}</span>

            <button 
              className="buy-button"
              onClick={(e) => {
                e.stopPropagation();
                // Logic thêm nhanh vào giỏ (nếu cần)
                console.log("Quick add:", title);
              }}
            >
              <FaShoppingCart className="cart-icon" />
              Mua
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm;