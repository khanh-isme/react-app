import React, { useState } from "react";
import styles from "./Register.module.scss";
import { registerUser } from "~/api/requests/auth.js"
import { Link,useNavigate } from "react-router-dom";

const Register = () => {
  const navigate =useNavigate();
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData);

      if(result){
        navigate('/login')
      }
      
    } catch (err) {
      console.log("Đăng ký thất bại!");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.title}>Register</div>
      
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Họ và tên"
          value={formData.username}
          onChange={handleChange}
          
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          
        />

        <button type="submit">Đăng ký</button>
      </form>

      <div className={styles.loginLink}>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </div>
    </div>
  );
};

export default Register;
