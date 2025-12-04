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
    // Chờ login redirect xong
    cy.url().should("include", "/");

    // Tìm Link chính xác đến productmanagement
    cy.get('a[href="/productmanagement"]').should("exist").click();

    // Xác nhận đã vào trang Product Management
    cy.url().should("include", "/productmanagement");
  }
}

export const loginPage = new LoginPage();
