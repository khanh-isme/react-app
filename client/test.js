async function login_authentication() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include", // thường không gửi cookie được ở Node
    });
    const data = await res.json();
    console.log("Kết quả:", data);
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

login_authentication(); // chạy thử