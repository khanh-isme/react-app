import React, { useState, useEffect } from 'react';
import { IoClose, IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"; // Thêm icon upload và xóa
import { createProduct, updateProduct } from '../../api/requests/product';
import './ProductFormModal.css';

const ProductFormModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  const initialFormState = {
    title: '',
    price: '',
    category: '',
    image: '',
    description: '',
    sizes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        sizes: productToEdit.sizes ? productToEdit.sizes.join(', ') : ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- HÀM XỬ LÝ CHỌN ẢNH ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Đọc file và chuyển sang dạng Base64 để hiển thị preview và gửi server
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      let res;
      if (productToEdit) {
        res = await updateProduct(productToEdit._id, payload);
      } else {
        res = await createProduct(payload);
      }

      if (res && res.success) {
        alert(productToEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        onSave();
        onClose();
      } else {
        alert("Có lỗi xảy ra: " + (res?.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pfm-overlay">
      <div className="pfm-container">
        <div className="pfm-header">
          <h2>{productToEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
          <button className="pfm-close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <form className="pfm-form" onSubmit={handleSubmit}>
          {/* Hàng 1 */}
          <div className="pfm-row">
            <div className="pfm-group">
              <label>Tên sản phẩm</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Ví dụ: Áo thun nam" 
                required 
              />
            </div>
            <div className="pfm-group">
              <label>Giá (VNĐ)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="Ví dụ: 100000" 
                required 
              />
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="pfm-row">
            <div className="pfm-group">
              <label>Danh mục</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">-- Chọn danh mục --</option>
                <option value="Thời trang">Thời trang</option>
                <option value="Giày dép">Giày dép</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Đồ điện tử">Đồ điện tử</option>
              </select>
            </div>
            <div className="pfm-group">
              <label>Sizes (cách nhau dấu phẩy)</label>
              <input 
                name="sizes" 
                value={formData.sizes} 
                onChange={handleChange} 
                placeholder="Ví dụ: S, M, L, XL" 
              />
            </div>
          </div>

          {/* --- KHU VỰC CHỌN ẢNH MỚI --- */}
          <div className="pfm-group">
            <label>Hình ảnh sản phẩm</label>
            
            {!formData.image ? (
              // 1. Nếu chưa có ảnh -> Hiện nút upload
              <div className="pfm-upload-box">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  id="file-upload"
                  className="pfm-file-input"
                />
                <label htmlFor="file-upload" className="pfm-upload-label">
                  <IoCloudUploadOutline className="pfm-upload-icon" />
                  <span>Bấm để chọn ảnh</span>
                </label>
              </div>
            ) : (
              // 2. Nếu đã có ảnh -> Hiện preview + nút xóa
              <div className="pfm-image-preview-container">
                <img src={formData.image} alt="Preview" className="pfm-image-preview" />
                <button type="button" className="pfm-remove-img-btn" onClick={handleRemoveImage}>
                  <IoTrashOutline /> Xóa ảnh
                </button>
              </div>
            )}
          </div>

          {/* Hàng 4 */}
          <div className="pfm-group">
            <label>Mô tả chi tiết</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="3" 
              placeholder="Nhập mô tả sản phẩm..." 
            ></textarea>
          </div>

          <div className="pfm-footer">
            <button type="button" className="pfm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="pfm-btn-save" disabled={loading}>
              {loading ? "Đang lưu..." : (productToEdit ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;