
export const validateUsername = (username) => {
  if (!username || username.trim() === "") {
    return "Vui lòng nhập tên đăng nhập.";
  }

  if (username.length < 3 || username.length > 50) {
    return "Tên đăng nhập phải từ 3 đến 50 ký tự.";
  }

  const regex = /^[a-zA-Z0-9._-]+$/;

  if (!regex.test(username)) {
    return "Tên đăng nhập chỉ được chứa chữ, số và các dấu ( . - _ )";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Vui lòng nhập mật khẩu.";
  }

  if (password.length < 6 || password.length > 100) {
    return "Mật khẩu phải từ 6 đến 100 ký tự.";
  }

  const hasLetter = /[a-zA-Z]/.test(password); 
  const hasNumber = /[0-9]/.test(password);   

  if (!hasLetter || !hasNumber) {
    return "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số.";
  }

  return ""; 
};


