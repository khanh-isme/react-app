import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa"; 
import './ProductCard.css';
import ProductDetailModal from './ProductDetailModal';

const ProductCard = ({ image, category, title, description, price }) => {
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Tạo object product để truyền vào modal
  const productData = { image, category, title, description, price, sizes: [38,39,40,41] };

  return (
    <>
      {/* 1. Đặt Modal RA NGOÀI thẻ product-card để không bị lỗi CSS overflow */}
      {showProductDetail && (
        <ProductDetailModal 
            product={productData}
            onClose={() => setShowProductDetail(false)} // SỬA LỖI 1: Thêm () =>
        /> 
      )}

      {/* 2. Thẻ Card chính */}
      <div 
        className="product-card" 
        onClick={() => setShowProductDetail(true)} // Click vào thẻ thì mở Modal
        style={{ cursor: 'pointer' }} // Thêm con trỏ tay để biết là click được
      >
        
        <div className="product-image-container">
          <img src={image} alt={title} className="product-image" />
        </div>

        <div className="product-content">
          <span className="product-category">{category}</span>
          
          <h3 className="product-title">{title}</h3>
          
          <p className="product-description">{description}</p>
          
          <div className="product-footer">
            <span className="product-price">{price}</span>
            
            {/* 3. Xử lý nút Mua để không bị mở Modal khi bấm */}
            <button 
                className="buy-button"
                onClick={(e) => {
                    e.stopPropagation(); // QUAN TRỌNG: Chặn sự kiện nổi bọt lên cha
                    console.log("Đã thêm vào giỏ, không mở modal");
                    // Code thêm vào giỏ hàng của bạn ở đây
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

export default ProductCard;