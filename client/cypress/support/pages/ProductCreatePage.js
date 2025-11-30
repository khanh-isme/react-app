class ProductCreatePage {
  elements = {
    // 1. SỬA LỖI CHÍNH: Dùng class thay vì Regex text để tìm nút (vì dấu + là icon)
    openModalBtn: () => cy.get(".pm-add-btn"),

    // Các element khác
    modal: () => cy.get(".pfm-container"),
    titleInput: () => cy.get('input[name="title"]'),
    priceInput: () => cy.get('input[name="price"]'),
    categorySelect: () => cy.get('select[name="category"]'),
    sizesInput: () => cy.get('input[name="sizes"]'),
    descriptionInput: () => cy.get('textarea[name="description"]'),
    
    // Upload file
    imageInput: () => cy.get('input[type="file"]'),

    // 2. SỬA LỖI NÚT LƯU: Trong code React nút là "Thêm mới", không phải "Lưu"
    saveBtn: () => cy.contains("button", "Thêm mới"), 
  };

  visit() {
    // Đảm bảo URL này đúng với local của bạn (thường là 3000)
    cy.visit("http://localhost:3000/productmanagement");
  }

  openCreateModal() {
    // 3. Click được gọi ở đây
    this.elements.openModalBtn().should("be.visible").click();
    this.elements.modal().should("be.visible");
  }

  fillForm({ title, price, category, sizes, description, imagePath }) {
    this.elements.titleInput().clear().type(title);
    this.elements.priceInput().clear().type(price);
    this.elements.categorySelect().select(category);
    this.elements.sizesInput().clear().type(sizes);
    this.elements.descriptionInput().clear().type(description);

    if (imagePath) {
      // force: true giúp upload kể cả khi input bị ẩn (hidden)
      this.elements.imageInput().selectFile(imagePath, { force: true });
    }
  }

  submit() {
    this.elements.saveBtn().click();
  }
}

export default new ProductCreatePage();