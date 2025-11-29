import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductForm from "./ProductForm";
import "./shop.css";
import Cart from "./Cart";
import { getAllProducts } from "../../api/requests/product";

function Shop() {
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts();

        if (res && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="shop-container">
      {showCart && <Cart onClose={() => setShowCart(false)} />}

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

      <div className="product-list">
        {products.map((product) => (
          <ProductForm
            key={product._id}
            _id={product._id}
            image={product.image}
            category={product.category}
            title={product.title}
            description={product.description}
            price={product.price}
            sizes={product.sizes || []}
          />
        ))}
      </div>
    </div>
  );
}

export default Shop;
