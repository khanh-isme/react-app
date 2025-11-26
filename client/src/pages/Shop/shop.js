import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "./ProductCard";
import './shop.css';
import Cart from './Cart';

function Shop() {
  const [showCart, setShowCart] = useState(false);

  // Dữ liệu mẫu
  const products = [
    {
      id: 1,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzsl34d402b842", 
      category: "Thời trang",
      title: "Áo thun cao cấp",
      description: "Chất liệu cotton cao cấp, thoáng mát",
      price: "299.000 ₫"
    },
    {
      id: 2,
      image: "https://ae01.alicdn.com/kf/S107502390a8848269784fb413d982181j/Gi-y-th-thao-nam-Gi-y-b-ng-r-ch-y-b-ngo-i.jpg", 
      category: "Giày dép",
      title: "Giày sneaker thể thao",
      description: "Thiết kế hiện đại, đế êm ái",
      price: "1.299.000 ₫"
    },
    {
      id: 3,
      image: "https://cdn.pnj.io/images/thumbnails/300/300/detailed/198/sp-gn0000y002237-dong-ho-kim-nu-day-kim-loai-jowissa-j5-634-m-vang-1.png",
      category: "Phụ kiện",
      title: "Đồng hồ thời trang",
      description: "Sang trọng, chống nước tốt",
      price: "899.000 ₫"
    }
  ];

  return (
    <div className="shop-container">
      {/* 1. Phần hiển thị Cart (Đặt ở ngoài cùng hoặc cuối container) */}
      {/* Chỉ hiển thị khi showCart = true */}
      {showCart && (
        <Cart onClose={() => setShowCart(false)} />
      )}

      {/* 2. Phần Header */}
      <div className="shop-header">
        <div className="shop-title-section">
          <h1>Cửa hàng</h1>
          <p>Khám phá các sản phẩm tuyệt vời</p>
        </div>
        
        {/* Nút bấm chỉ làm nhiệm vụ đổi state thành true */}
        <button 
            className="main-cart-btn" 
            onClick={() => setShowCart(true)}
        >
          <FaShoppingCart style={{ marginRight: '8px' }} />
          Giỏ hàng
        </button>
      </div>

    {/* 3. Phần Lưới sản phẩm */}
      <div className="product-list">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            image={product.image}
            category={product.category}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default Shop;