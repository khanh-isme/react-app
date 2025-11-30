class ProductPage {
  // ===========================
  // 1. SELECTORS
  // ===========================
  elements = {
    // --- Header & Search ---
    addProductBtn: () => cy.get('.pm-add-btn'),
    searchInput: () => cy.get('.pm-search-input'),

    // --- Table & Rows ---
    table: () => cy.get('.pm-table'),
    tableRows: () => cy.get('.pm-table tbody tr'),
    emptyMessage: () => cy.contains('td', 'Không tìm thấy kết quả phù hợp'),

    // --- Modal Form (Create/Edit) ---
    modal: () => cy.get(".pfm-container"),
    modalTitle: () => cy.get(".pfm-header h2"),
    
    // Inputs
    titleInput: () => cy.get('input[name="title"]'),
    priceInput: () => cy.get('input[name="price"]'),
    categorySelect: () => cy.get('select[name="category"]'),
    sizesInput: () => cy.get('input[name="sizes"]'),
    descriptionInput: () => cy.get('textarea[name="description"]'),
    
    // Upload
    fileInput: () => cy.get('input[type="file"]'),

    // Buttons Modal
    submitBtn: () => cy.get('.pfm-btn-save'), // Class chuẩn trong code bạn
    cancelBtn: () => cy.get('.pfm-btn-cancel'),
  };

  // ===========================
  // 2. METHODS
  // ===========================

  visit() {
    cy.visit("http://localhost:3000/productmanagement");
  }

  // --- ACTIONS TRÊN MODAL ---
  openCreateModal() {
    this.elements.addProductBtn().should("be.visible").click();
    this.elements.modal().should("be.visible");
  }

  fillForm({ title, price, category, sizes, description, imagePath }) {
    if (title) this.elements.titleInput().clear().type(title);
    if (price) this.elements.priceInput().clear().type(price);
    if (category) this.elements.categorySelect().select(category);
    if (sizes) this.elements.sizesInput().clear().type(sizes);
    if (description) this.elements.descriptionInput().clear().type(description);

    if (imagePath) {
      this.elements.fileInput().selectFile(imagePath, { force: true });
    }
  }

  submit() {
    this.elements.submitBtn().click();
  }

  // --- ACTIONS TRÊN TABLE (Edit/Delete/Search) --A-

  // Tìm kiếm sản phẩm
  searchProduct(keyword) {
    // SỬA LỖI: Kiểm tra nếu có keyword thì mới type, không thì chỉ clear
    if (keyword) {
      this.elements.searchInput().clear().type(keyword);
    } else {
      this.elements.searchInput().clear();
    }
    
    // Chờ một chút để UI lọc (client-side search)
    cy.wait(500); 
  }

  // Click nút Sửa của 1 sản phẩm cụ thể
  clickEditProduct(productName) {
    // Tìm dòng chứa tên SP -> Tìm nút Edit trong dòng đó
    cy.contains('tr', productName)
      .find('.pm-action-btn.edit')
      .click();
  }

  // Click nút Xóa của 1 sản phẩm cụ thể
  clickDeleteProduct(productName) {
    // Tìm dòng chứa tên SP -> Tìm nút Delete trong dòng đó
    cy.contains('tr', productName)
      .find('.pm-action-btn.delete')
      .click();
  }

  // Kiểm tra sản phẩm có hiển thị trong bảng không
  verifyProductVisible(productName) {
    this.elements.table().should('contain', productName);
  }

  // Kiểm tra sản phẩm KHÔNG hiển thị
  verifyProductNotVisible(productName) {
    this.elements.table().should('not.contain', productName);
  }
}

export default new ProductPage();