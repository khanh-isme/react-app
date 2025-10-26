import { useState, useContext } from "react";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/requests/auth.js";
import { AuthContext } from "../../redux/AuthContext.js";
import { Notification } from "../../components/Notification/Notification.js";
function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); // ngăn reload

    try {
      const result = await loginUser(username, password);

      if (result && result.user) {
        login(result.user);
        navigate("/");
      } else {
        setMessage("");
        setTimeout(() => {
          setMessage(result.message || "Đăng nhập thất bại!");
        }, 10);
      }
    } catch (err) {
      setMessage("");
      setTimeout(() => {
        setMessage(err.message);
      }, 10);
    }
  };

  return (
    <>
      <Notification message={message} />
      <div className={styles.loginContainer}>
        <img src="/images/logo.webp" className={styles.logo}></img>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type=""
            placeholder="Email hoặc số điện thoại"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Đăng nhập</button>

          <a href="/forgot" className={styles.forgotLink}>
            Quên mật khẩu?
          </a>

          <hr />

          <Link to="/register" className={styles.regis}>
            Tạo tài khoản mới
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
