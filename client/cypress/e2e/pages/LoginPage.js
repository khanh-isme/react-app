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

  // 2. Chờ Sidebar Header xuất hiện
  cy.get("nav").should("be.visible");

  // 3. Chờ menu được render (có chữ Product Management bất kỳ)
  cy.contains("span", "Product Management", { timeout: 8000 })
    .should("be.visible")
    .click();

  // 4. Kiểm tra đã vào đúng trang
  cy.url().should("include", "/productmanagement");
}

}

export const loginPage = new LoginPage();
