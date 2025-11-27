import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductForm from "./ProductForm";
import "./shop.css";
import Cart from "./Cart";
import { getAllProducts } from "../../api/requests/product";
function Shop() {
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);

  // Hàm format tiền tệ (Việt Nam Đồng)
  const formatMoney = (amount) => {
    // Kiểm tra nếu amount không phải số thì trả về 0đ hoặc giữ nguyên
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Gọi hàm đã tách riêng
      const data = await getAllProducts();

      // Kiểm tra dữ liệu trả về
      if (data && data.success) {
        setProducts(data.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="shop-container">
      {/* 1. Phần Cart Overlay */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}

      {/* 2. Phần Header */}
      <div className="shop-header">
        <div className="shop-title-section">
          <h1>Cửa hàng</h1>
          <p>Khám phá các sản phẩm tuyệt vời</p>
        </div>

        <button className="main-cart-btn" onClick={() => setShowCart(true)}>
          <FaShoppingCart style={{ marginRight: "8px" }} />
          Giỏ hàng
        </button>
      </div>

      {/* 3. Phần Lưới sản phẩm */}
      <div className="product-list">
        {products.map((product) => (
          <ProductForm
            key={product._id}
            _id={product._id} // THIẾT YẾU
            image={product.image}
            category={product.category}
            title={product.title}
            description={product.description}
            price={formatMoney(product.price)} // vẫn ok
            sizes={product.sizes || []} // THIẾT YẾU
          />
        ))}
      </div>
    </div>
  );
}

export default Shop;
