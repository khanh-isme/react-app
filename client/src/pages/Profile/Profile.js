import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout/Layout";
import { FaPlus } from "react-icons/fa";
import "./Profile.scss";
import AvatarDefault from "./default-avatar.webp";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      setUser(JSON.parse(auth));
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  if (!user) {
    return <p>Đang tải...</p>;
  }



  return (
    <div className="profile-container">
      <div className="profile-header">

        <div className="profile-avatar">
          <img
            src={ AvatarDefault}
            alt="avatar"
            className="avatar-img"
          />
        </div>

        <div className="profile-info">
          <div className="profile-username">
            <h2>{user.username}</h2>
            <span className="settings-icon">⚙️</span>
          </div>
          
          <p className="realname">{user.fullname || "Văn Khánh"}</p>

          <div className="profile-stats">
            <span>0 posts</span>
            <span>16 followers</span>
            <span>8 following</span>
          </div>

          <p className="nickname">@{user.username}</p>

          <div className="profile-buttons">
            <button className="edit-btn">Edit profile</button>
            <button className="archive-btn">View archive</button>
          </div>
          
        </div>
      </div>

      <div className="profile-content">
        <div className="new-post">
          <div className="circle">
            <FaPlus size={24} />
          </div>
          <p>New</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
