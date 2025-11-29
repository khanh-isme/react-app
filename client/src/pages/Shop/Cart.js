import React, { useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaTrashAlt, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import './Cart.css';

const Cart = ({ onClose }) => { 
  const popupRef = useRef(null);

  // 1. Khởi tạo State từ LocalStorage (để không bị mất khi reload)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("shopping_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Lưu vào LocalStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("shopping_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Xử lý click ra ngoài để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  // Format tiền tệ
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tăng số lượng
  const handleIncrease = (id, size) => {
    const newCart = cartItems.map(item => {
      // Phải so sánh cả ID và Size (vì cùng ID nhưng khác size là item khác nhau)
      if (item._id === id && item.selectedSize === size) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(newCart);
  };

  // Giảm số lượng
  const handleDecrease = (id, size) => {
    const newCart = cartItems.map(item => {
      if (item._id === id && item.selectedSize === size) {
        const newQty = item.quantity - 1;
        return { ...item, quantity: newQty < 1 ? 1 : newQty }; // Không cho giảm dưới 1
      }
      return item;
    });
    setCartItems(newCart);
  };

  // Xóa sản phẩm
  const handleRemove = (id, size) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      const newCart = cartItems.filter(
        item => !(item._id === id && item.selectedSize === size)
      );
      setCartItems(newCart);
    }
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }
    alert(`Thanh toán thành công số tiền: ${formatMoney(totalPrice)}`);
    setCartItems([]); // Xóa giỏ hàng sau khi thanh toán giả định
    localStorage.removeItem("shopping_cart");
    onClose();
  };

  return (
    <div className="cart-overlay">
      <div className="cart-container" ref={popupRef}>
        
        {/* Header */}
        <div className="cart-nav" onClick={onClose}>
          <FaArrowLeft className="icon-back" />
          <span>Tiếp tục mua sắm</span>
        </div>

        <h2 className="cart-title">Giỏ hàng ({cartItems.length})</h2>

        {/* List Items */}
        <div className="cart-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
                <FaShoppingBag size={50} color="#ccc" />
                <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              // Dùng index làm key phụ để tránh lỗi duplicate key nếu id trùng
              <div key={`${item._id}-${item.selectedSize}-${index}`} className="cart-item">
                <img src={item.image} alt={item.title} className="item-img" />
                
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="item-size">Size: {item.selectedSize}</p>
                  
                  <div className="item-controls">
                    <span className="price-tag">{formatMoney(item.price)}</span>
                    
                    <div className="quantity-box">
                        <button 
                          className="qty-btn" 
                          onClick={() => handleDecrease(item._id, item.selectedSize)}
                        >
                          <FaMinus size={10} />
                        </button>
                        
                        <span className="qty-value">{item.quantity}</span>
                        
                        <button 
                          className="qty-btn" 
                          onClick={() => handleIncrease(item._id, item.selectedSize)}
                        >
                          <FaPlus size={10} />
                        </button>
                    </div>
                  </div>
                </div>

                <div className="item-actions-right">
                    <div className="item-total-price">
                        {formatMoney(item.price * item.quantity)}
                    </div>
                    <button 
                      className="btn-remove" 
                      onClick={() => handleRemove(item._id, item.selectedSize)}
                    >
                      <FaTrashAlt />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
                <span>Tổng cộng:</span>
                <span className="summary-total">{formatMoney(totalPrice)}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;