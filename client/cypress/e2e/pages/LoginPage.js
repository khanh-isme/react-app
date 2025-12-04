class LoginPage {
  elements = {
    usernameInput: () =>
      cy.get('input[placeholder="Email hoặc số điện thoại"]'),
    passwordInput: () => cy.get('input[placeholder="Mật khẩu"]'),

    // FIX: Selector chính xác, không bị trùng trang Home
    loginBtn: () => cy.get('[data-testid="login-btn"]'),

    notificationMessage: () => cy.get(".notification p"),
    notificationCloseBtn: () => cy.get(".notification .close-btn"),
    homePostCaption: () => cy.contains("Windmills and silence"),
  };

  visit() {
    cy.visit("/login");
  }

  typeUsername(text) {
    this.elements.usernameInput().clear().type(text);
  }
  typePassword(text) {
    this.elements.passwordInput().clear().type(text);
  }

  clickLogin() {
    this.elements.loginBtn().click();
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLogin();
  }

  goToProductPage() {
  // 1. Chờ login redirect xong
  cy.url().should("include", "/");

  // 2. Reload để AuthContext đọc user từ localStorage
  cy.reload();

  // 3. Chờ sidebar hiển thị
  cy.get("nav", { timeout: 8000 }).should("be.visible");

  // 4. Click vào text Product Management
  cy.contains("span", "Product Management", { timeout: 8000 }).click();

  // 5. Kiểm tra đã vào trang
  cy.url().should("include", "/productmanagement");
}


}

export const loginPage = new LoginPage();
