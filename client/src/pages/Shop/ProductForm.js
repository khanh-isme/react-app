import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa"; 
import './ProductCard.css';
import ProductDetailModal from './ProductDetailModal';

const ProductForm = ({ _id, image, category, title, description, price, sizes }) => {

  const [showProductDetail, setShowProductDetail] = useState(false);

  // Đóng gói đầy đủ product object
  const productData = { 
    _id,
    image, 
    category, 
    title, 
    description, 
    price,
    sizes: sizes || [38, 39, 40, 41] // fallback
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
          <img src={image} alt={title} className="product-image" />
        </div>

        <div className="product-content">
          <span className="product-category">{category}</span>
          <h3 className="product-title">{title}</h3>
          <p className="product-description">{description}</p>

          <div className="product-footer">
            <span className="product-price">{price}</span>

            <button 
              className="buy-button"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Đã thêm vào giỏ, không mở modal");
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
