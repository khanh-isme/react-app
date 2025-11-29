import React, { useState } from "react";
import { FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "./ProductDetailModal.css";

const ProductDetailModal = ({ product, onClose }) => {
  // State quản lý size đang chọn và số lượng
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu fallback
  const defaultProduct = {
    image: "https://via.placeholder.com/400",
    category: "Danh mục",
    title: "Sản phẩm mẫu",
    price: 0,
    description: "Chưa có mô tả",
    sizes: [],
  };

  const currentProduct = product || defaultProduct;

  // Hàm format tiền tệ chuẩn
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý tăng giảm số lượng
  const handleQuantityChange = (type) => {
    if (type === "decrease") {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  // Tổng tiền = giá (Number) * số lượng
  const totalPrice = (currentProduct.price || 0) * quantity;

  // Trong file ProductDetailModal.js

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size!");
      return;
    }

    // 1. Tạo object sản phẩm mới
    const newItem = {
      _id: currentProduct._id,
      title: currentProduct.title,
      image: currentProduct.image,
      price: currentProduct.price, // Đảm bảo đây là Number
      selectedSize: selectedSize,
      quantity: quantity,
    };

    // 2. Lấy giỏ hàng cũ từ LocalStorage
    const savedCart = localStorage.getItem("shopping_cart");
    let cartItems = savedCart ? JSON.parse(savedCart) : [];

    // 3. Kiểm tra xem sản phẩm (cùng ID, cùng Size) đã có chưa
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item._id === newItem._id && item.selectedSize === newItem.selectedSize
    );

    if (existingItemIndex !== -1) {
      // Nếu có rồi -> Cộng dồn số lượng
      cartItems[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Nếu chưa -> Thêm mới vào mảng
      cartItems.push(newItem);
    }

    // 4. Lưu ngược lại vào LocalStorage
    localStorage.setItem("shopping_cart", JSON.stringify(cartItems));

    alert("Đã thêm vào giỏ hàng thành công!");

    // 5. Đóng modal (Sau đó nếu bạn mở Cart ra sẽ thấy sản phẩm)
    onClose();

    // Lưu ý: Để Cart tự động update ngay lập tức mà không cần reload trang
    // chúng ta thường cần dùng Context API hoặc Redux.
    // Tuy nhiên với cách dùng localStorage đơn giản này, bạn cần reload trang
    // hoặc tắt mở lại Cart thì mới thấy data mới nhất.
  };

  return (
    <div className="pdm-overlay" onClick={onClose}>
      <div className="pdm-container" onClick={(e) => e.stopPropagation()}>
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

          {/* Cột phải: Thông tin */}
          <div className="pdm-right-col">
            <span className="pdm-category">{currentProduct.category}</span>
            <h2 className="pdm-title">{currentProduct.title}</h2>
            <p className="pdm-price">{formatMoney(currentProduct.price)}</p>

            <div className="pdm-section">
              <h3>Mô tả sản phẩm</h3>
              <p className="pdm-description">{currentProduct.description}</p>
            </div>

            {/* Chọn Size */}
            {currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <div className="pdm-section">
                <h3>Chọn size</h3>
                <div className="pdm-size-grid">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size}
                      className={`pdm-size-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chọn Số lượng */}
            <div className="pdm-section">
              <h3>Số lượng</h3>
              <div className="pdm-quantity-box">
                <button onClick={() => handleQuantityChange("decrease")}>
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange("increase")}>
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Nút thêm vào giỏ */}
            <button className="pdm-add-to-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart style={{ marginRight: "10px" }} />
              Thêm vào giỏ - {formatMoney(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
