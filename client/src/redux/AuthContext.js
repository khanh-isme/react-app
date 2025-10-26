import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? { user: JSON.parse(savedUser) } : { user: null };
  });

  //  Xác minh đăng nhập khi vừa load trang
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include", 
        });

        const data = await res.json();

        if (res.ok && data.user) {
          console.log("✅ Đăng nhập hợp lệ:", data.user);
          setAuth({ user: data.user });
        } else {
          console.warn(" Không hợp lệ:", data.message);
          setAuth({ user: null });
          navigate("/login"); 
        }
      } catch (err) {
        console.error("❌ Lỗi kết nối server:", err);
        setAuth({ user: null });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Lưu thông tin user vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (auth.user) localStorage.setItem("user", JSON.stringify(auth.user));
    else localStorage.removeItem("user");
  }, [auth]);

  const login = (user) => setAuth({ user }); // Đăng nhập 

  return (
    <AuthContext.Provider value={{ auth, login }}>
      {children}
    </AuthContext.Provider>
  );
}
