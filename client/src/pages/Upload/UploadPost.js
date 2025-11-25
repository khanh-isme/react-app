import React, { useEffect, useRef, useState } from "react";
import "./UploadPost.scss";
import CreatePost from "./CreatePost";

export default function UploadPost({ onClose }) {
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSelectFile = () => {
    fileInputRef.current.click(); // kích hoạt click ẩn
  };

  // Khi người dùng chọn file xong
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Tạo danh sách URL tạm
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));

    console.log("Danh sách ảnh:", urls);

    // Cập nhật state
    setPreviewUrls(urls);
  };

  if (previewUrls.length > 0) {
    return (
      <CreatePost
        imageUrls={previewUrls}
        onClose={() => {
          // Hủy URL khi đóng để tránh rò rỉ bộ nhớ
          previewUrls.forEach((url) => URL.revokeObjectURL(url));
          setPreviewUrls([]);
        }}
      />
    );
  }

  return (
    <div className="upload-overlay">
      <div className="upload-popup" ref={panelRef}>
        <div className="upload-header">
          <h2>Create new post</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="upload-content">
          <div className="upload-icon">📷</div>
          <p className="upload-text">Drag photos and videos here</p>

          <button className="upload-btn" onClick={handleSelectFile}>
            Select from computer
          </button>

          {/* input file ẩn */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
