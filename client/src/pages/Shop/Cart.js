// Cart.js
import React, {useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import './Cart.css';


const Cart = ({ onClose }) => { 

    const popupRef = useRef(null);

  // Dữ liệu mẫu
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzsl34d402b842",
      name: "Áo thun cao cấp",
      size: "S",
      price: 299000,
      quantity: 1
    }
  ]);


   useEffect(() => {
      const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          onClose && onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);







  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formatMoney = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";

  return (
    // Lớp phủ mờ (click vào đây sẽ đóng cart)
    <div className="cart-overlay" onClick={onClose}>
      
      {/* Ngăn sự kiện click đóng cart khi click vào nội dung chính */}
      <div className="cart-container"  ref={popupRef} onClick={(e) => e.stopPropagation()}>
        
        {/* Header: Nút đóng */}
        <div className="cart-nav" onClick={onClose}>
          <FaArrowLeft className="icon-back" />
          <span>Tiếp tục mua sắm (Đóng)</span>
        </div>

        <h2 className="cart-title">Giỏ hàng của bạn</h2>

        <div className="cart-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-img" />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-size">Size: {item.size}</p>
                <div className="item-controls">
                  <span className="price-tag">{formatMoney(item.price)}</span>
                  <div className="quantity-box">
                      <button className="qty-btn"><FaMinus /></button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn"><FaPlus /></button>
                  </div>
                </div>
              </div>
              <div className="item-total-price">
                  {formatMoney(item.price * item.quantity)}
              </div>
              <button className="btn-remove"><FaTrashAlt /></button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
              <span>Tổng cộng:</span>
              <span className="summary-total">{formatMoney(totalPrice)}</span>
          </div>
          <button className="btn-checkout">Tiến hành thanh toán</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;