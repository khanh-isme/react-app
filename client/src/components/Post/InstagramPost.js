import React from "react";
import { FaHeart, FaRegComment, FaPaperPlane, FaBookmark } from "react-icons/fa";
import "./InstagramPost.scss";

function InstagramPost({ post }) {
  return (
    <div className="instaPost">
      {/* --- Header --- */}
      <div className="postHeader">
        <div className="userInfo">
          <img src={post.avatar} alt="avatar" className="avatar" />
          <span className="username">{post.username}</span>
          <span className="dot">•</span>
          <span className="time">{post.time}</span>
        </div>
        <div className="more">⋯</div>
      </div>

      {/* --- Image --- */}
      <div className="postImage">
        <img src={post.image} alt="post content" />
      </div>

      {/* --- Actions --- */}
      <div className="postActions">
        <div className="leftActions">
          <FaHeart className="icon" />
          <FaRegComment className="icon" />
          <FaPaperPlane className="icon" />
        </div>
        <FaBookmark className="icon" />
      </div>

      {/* --- Likes --- */}
      <div className="likes">{post.likes} likes</div>

      {/* --- Caption --- */}
      <div className="caption">
        <span className="username">{post.username}</span> {post.caption}
      </div>

      {/* --- Comments --- */}
      <div className="comments">
        View all {post.commentsCount} comments
      </div>

      {/* --- Add comment --- */}
      <div className="addComment">
        <input type="text" placeholder="Add a comment..." />
        <button>Post</button>
      </div>
    </div>
  );
}

export default InstagramPost;
