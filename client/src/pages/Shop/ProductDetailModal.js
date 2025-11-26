import React, { useState } from 'react';
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Icon dấu X đẹp hơn
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, onClose }) => {
  // State quản lý size đang chọn và số lượng
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu giả lập nếu không truyền product vào (để test)
  const defaultProduct = {
    image: "https://ae01.alicdn.com/kf/S107502390a8848269784fb413d982181j/Gi-y-th-thao-nam-Gi-y-b-ng-r-ch-y-b-ngo-i.jpg",
    category: "Giày dép",
    title: "Giày sneaker thể thao",
    price: 1299000,
    description: "Thiết kế hiện đại, đế êm ái",
    sizes: [38, 39, 40, 41, 42, 43] // Danh sách size có sẵn
  };

  const currentProduct = product || defaultProduct;

  // Hàm format tiền tệ VNĐ
  const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  // Xử lý tăng giảm số lượng
  const handleQuantityChange = (type) => {
    if (type === 'decrease') {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    } else {
      setQuantity(prev => prev + 1);
    }
  };

  // Tổng tiền = giá * số lượng
  const totalPrice = currentProduct.price * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
        alert("Vui lòng chọn size!");
        return;
    }
    console.log("Thêm vào giỏ:", {
        ...currentProduct,
        selectedSize,
        quantity,
        totalPrice
    });
    // Sau khi thêm xong thì đóng modal
    onClose();
  };

  return (
    // Lớp phủ mờ background
    <div className="pdm-overlay" onClick={onClose}>
      
      {/* Container chính của modal */}
      <div className="pdm-container" onClick={e => e.stopPropagation()}>
        
        {/* Nút đóng X ở góc trên phải */}
        <button className="pdm-close-btn" onClick={onClose}>
            <IoClose size={24} color="#666" />
        </button>

        <div className="pdm-content">
            {/* Cột trái: Hình ảnh */}
            <div className="pdm-left-col">
                <div className="pdm-image-wrapper">
                    <img src={currentProduct.image} alt={currentProduct.title} />
                </div>
            </div>

            {/* Cột phải: Thông tin và lựa chọn */}
            <div className="pdm-right-col">
                <span className="pdm-category">{currentProduct.category}</span>
                <h2 className="pdm-title">{currentProduct.title}</h2>
                <p className="pdm-price">{formatMoney(currentProduct.price)}</p>

                <div className="pdm-section">
                    <h3>Mô tả sản phẩm</h3>
                    <p className="pdm-description">{currentProduct.description}</p>
                </div>

                {/* Chọn Size */}
                <div className="pdm-section">
                    <h3>Chọn size</h3>
                    <div className="pdm-size-grid">
                        {currentProduct.sizes.map((size) => (
                            <button 
                                key={size} 
                                // Thêm class 'active' nếu size này đang được chọn
                                className={`pdm-size-btn ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chọn Số lượng */}
                <div className="pdm-section">
                    <h3>Số lượng</h3>
                    <div className="pdm-quantity-box">
                        <button onClick={() => handleQuantityChange('decrease')}><FaMinus /></button>
                        <span>{quantity}</span>
                        <button onClick={() => handleQuantityChange('increase')}><FaPlus /></button>
                    </div>
                </div>

                {/* Nút thêm vào giỏ hàng (Full width) */}
                <button className="pdm-add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart style={{ marginRight: '10px' }} />
                    Thêm vào giỏ hàng - {formatMoney(totalPrice)}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;