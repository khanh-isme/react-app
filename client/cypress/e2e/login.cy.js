import { loginPage } from "./pages/LoginPage";

describe("6.1.2 E2E Test Scenarios cho Login", () => {
  beforeEach(() => {
    loginPage.visit();
  });

  // --- Yêu cầu d) Test UI elements interactions (0.5 điểm) ---
  it("UI Interaction: Should allows typing and clicking", () => {
    // Kiểm tra gõ phím
    loginPage.typeUsername("testuser");
    loginPage.elements.usernameInput().should("have.value", "testuser");

    loginPage.typePassword("123456");
    loginPage.elements.passwordInput().should("have.value", "123456");

    // Kiểm tra nút bấm hiển thị
    loginPage.elements.loginBtn().should("be.visible").and("not.be.disabled");
  });

  // --- Yêu cầu b) Test validation messages (0.5 điểm) ---
  it("Validation: Should show HTML5 validation if fields are empty", () => {
    // Vì code React dùng attribute `required`, trình duyệt sẽ chặn submit.
    // Cypress kiểm tra pseudo-class :invalid

    // 1. Submit khi để trống cả 2
    loginPage.clickLogin();
    loginPage.elements.usernameInput().then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.exist;
    });

    // 2. Điền user, để trống pass
    loginPage.typeUsername("user");
    loginPage.clickLogin();
    loginPage.elements.passwordInput().then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
  });

  // --- Yêu cầu c) Test error flows (0.5 điểm) ---
  it("Error Flow: Should show notification when login fails", () => {
    // Mock API trả về lỗi 401 (Sai mật khẩu)
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 401,
      body: { message: "Sai username hoặc password" },
    }).as("loginFail");

    loginPage.login("wronguser", "wrongpass");

    // Chờ API gọi xong
    cy.wait("@loginFail");

    // Kiểm tra Notification xuất hiện với đúng text
    loginPage.elements
      .notificationMessage()
      .should("be.visible")
      .and("have.text", "Sai username hoặc password");

    // Đảm bảo vẫn ở trang login (URL chưa đổi)
    cy.url().should("include", "/login");
  });

  // --- Yêu cầu a) Test complete login flow (1 điểm) ---
  it("Complete Flow: Should redirect to Home on success", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        user: { id: 1, username: "vip_user", avatar: "" },
      },
    }).as("loginSuccess");

    cy.intercept("GET", "**/api/**", (req) => {
      req.reply({ success: true, data: [] });
    });

    // Thực hiện Login
    loginPage.login("vip_user", "password123");

    // Chờ login thành công
    cy.wait("@loginSuccess");

    // Chờ redirect xảy ra
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    // Đợi React render trang mới
    cy.get("body").then(() => {
      // Kiểm tra nút login đã biến mất
      loginPage.elements.loginBtn().should("not.exist");
    });
  });
});
