import React, { useState, useEffect } from "react"; 
import "./Notification.scss"; 
import { FaTimes } from "react-icons/fa";
export function Notification({ message,duration=3000 }) {
  const [showPopup, setShowPopup] = useState(false);

 useEffect(() => {
    if (!message) return;

    // Reset popup state để animation chạy lại
    setShowPopup(false);
    const resetTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10);

    // Auto hide sau duration
    const hideTimer = setTimeout(() => {
      setShowPopup(false);
    }, duration);

    // Cleanup khi message đổi nhanh liên tiếp
    return () => {
      clearTimeout(resetTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration]);

  return (
    <div>

      <div className={`notification ${showPopup ? "active" : ""}`}>
        <div className="icon">🔔</div>
        <p>{message}</p>
        <button className="close-btn" onClick={() => setShowPopup(false)}>
          <FaTimes/>
        </button>
      </div>
    </div>
  );
}
