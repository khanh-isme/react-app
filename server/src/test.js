// testAuthController.js
import { register,loginUser } from "./controllers/authController.js";

// Mock request và response
const mockReq = {
  body: {
    username: "testuser1",
    password: "123456",
    email:"123"
  }
};

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log("Response:", this.statusCode, data);
  }
};

// Gọi trực tiếp
//register(mockReq, mockRes);
const mockReq1 = {
  body: {
    username: "aa",
    password: "1"
  }
};

const mockRes1 = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log("Response:", this.statusCode, data);
  }
};

// Gọi trực tiếp hàm loginUser
(async () => {
  await loginUser(mockReq1, mockRes1);
})();
