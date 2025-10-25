import React, { useState, useEffect } from "react"; 
import "./Notification.scss"; 
import { FaTimes } from "react-icons/fa";
export function Notification({ message,duration=3000 }) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect( ()=>{
    if(message){
        setShowPopup(true);
        setTimeout(() =>{
            setShowPopup(false);
        },duration);
    }
  },[message]);

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
