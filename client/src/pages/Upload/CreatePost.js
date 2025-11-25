import React, { useRef, useEffect, useState } from "react";
import "./CreatePost.scss";

export default function CreatePost({ imageUrls = [], onClose }) {
  const popupRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData,setFormData] = useState({
    title: "",
    content:"",
    userId :"",
    imageUrl:[]
  });

  const handleShare = (e) =>{
    setFormData({
      ...formData,
      [e.value.name]: e.target.name,
    })
  }

  // 🔹 Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 🔹 Chuyển ảnh
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : imageUrls.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < imageUrls.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post-popup" ref={popupRef}>
        {/* --- HEADER --- */}
        <div className="create-post-header">
          <h3>Create new post </h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
          <button className="share-btn">Share</button>
        </div>

        {/* --- BODY --- */}
        <div className="create-post-body">
          {/* BÊN TRÁI: hiển thị nhiều ảnh */}
          <div className="create-post-image">
            {imageUrls.length > 0 ? (
              <>
                <img
                  src={imageUrls[currentIndex]}
                  alt={`preview-${currentIndex}`}
                  className="preview-img"
                />
                {imageUrls.length > 1 && (
                  <>
                    <button className="nav-btn prev" onClick={handlePrev}>
                      ‹
                    </button>
                    <button className="nav-btn next" onClick={handleNext}>
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="empty-preview">No image selected</div>
            )}
          </div>

          {/* BÊN PHẢI: thông tin bài viết */}
          <div className="create-post-info">
            <div className="user-info">
              <div className="avatar"></div>
              <span className="username">kh__h.18</span>
            </div>

            <textarea
              placeholder="Write a caption..."
              maxLength={2200}
              className="caption-input"
            ></textarea>

            <div className="post-options">
              <div className="option-item">
                <span>Add location</span>
                <i className="fa fa-map-marker"></i>
              </div>
              <div className="option-item">
                <span>Add collaborators</span>
                <i className="fa fa-user-plus"></i>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
