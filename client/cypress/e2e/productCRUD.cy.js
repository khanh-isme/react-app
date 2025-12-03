import ProductPage from '../support/pages/ProductPage';
import { loginPage } from '../e2e/pages/LoginPage';

describe('6.2.2 Product CRUD Operations', () => {
  
  // Dữ liệu test
  const productData = {
    title: `Sản phẩm Test E2E ${Date.now()}`, // Tên động để tránh trùng
    price: '200000',
    category: 'Giày dép',
    sizes: '39, 40, 41',
    description: 'Mô tả ban đầu'
  };

  const updatedData = {
    title: productData.title + ' (Đã Sửa)',
    price: '250000',
    description: 'Mô tả đã cập nhật'
  };

  beforeEach(() => {
  loginPage.visit();
  loginPage.login("k", "1");
  cy.wait(800);

  // Điều hướng đúng theo UI thật: Sidebar → Product Management
  loginPage.goToProductPage();

  // Xác nhận đã vào trang Product
  cy.url().should("include", "/productmanagement");

  // Đảm bảo nút Add Product và bảng tồn tại
  ProductPage.elements.addProductBtn().should("be.visible");
  ProductPage.elements.table().should("exist");
});


  // --- a) Test Create product flow (0.5 điểm) ---
  it('a) Create: Nên thêm mới sản phẩm thành công', () => {
    ProductPage.openCreateModal();
    ProductPage.fillForm(productData);
    ProductPage.submit();

    // Verify Alert
    cy.on('window:alert', (text) => {
      expect(text).to.contains('thành công');
    });

    // Verify Modal đóng
    ProductPage.elements.modal().should('not.exist');
  });

  // --- b) Test Read/List products (0.5 điểm) ---
  it('b) Read: Sản phẩm vừa tạo phải xuất hiện trong danh sách', () => {
    // Kiểm tra tên sản phẩm xuất hiện trong bảng
    ProductPage.verifyProductVisible(productData.title);
    
    // Kiểm tra giá tiền đã format (200000 -> 200.000)
    // Dùng regex để tìm chuỗi chứa 200 và 000
    cy.contains('tr', productData.title).should('contain', '200.000');
    
    // Kiểm tra danh mục
    cy.contains('tr', productData.title).should('contain', productData.category);
  });

  // --- c) Test Update product (0.5 điểm) ---
  it('c) Update: Nên cập nhật thông tin sản phẩm thành công', () => {
    // 1. Click nút sửa của sản phẩm vừa tạo
    ProductPage.clickEditProduct(productData.title);

    // 2. Kiểm tra modal mở ra có đúng dữ liệu cũ không
    ProductPage.elements.titleInput().should('have.value', productData.title);
    ProductPage.elements.priceInput().should('have.value', productData.price);

    // 3. Thay đổi thông tin
    ProductPage.fillForm({
      title: updatedData.title,
      price: updatedData.price,
      description: updatedData.description
    });

    // 4. Lưu lại
    ProductPage.submit();

    // 5. Verify Alert
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Cập nhật thành công');
    });

    // 6. Verify dữ liệu mới trên bảng
    ProductPage.verifyProductVisible(updatedData.title);
    cy.contains('tr', updatedData.title).should('contain', '250.000');
  });

  // --- e) Test Search/Filter functionality (0.5 điểm) ---
  // (Làm Search trước Delete để còn dữ liệu mà tìm)
  it('e) Search: Nên tìm kiếm được sản phẩm theo tên', () => {
    // 1. Nhập từ khóa tìm kiếm (Tên sản phẩm đã update)
    ProductPage.searchProduct(updatedData.title);

    // 2. Kiểm tra sản phẩm đó CÓ hiển thị
    ProductPage.verifyProductVisible(updatedData.title);

    // 3. Nhập từ khóa rác không tồn tại
    ProductPage.searchProduct('Tên Này Chắc Chắn Không Có 123456');

    // 4. Kiểm tra thông báo không tìm thấy (nếu có) hoặc bảng rỗng
    // Trong code bạn: "Không tìm thấy kết quả phù hợp."
    cy.contains('td', 'Không tìm thấy kết quả phù hợp').should('be.visible');
  });

  // --- d) Test Delete product (0.5 điểm) ---
  it('d) Delete: Nên xóa sản phẩm thành công', () => {
    // Reset thanh tìm kiếm để thấy sản phẩm cần xóa
    ProductPage.searchProduct(''); 
    cy.wait(500);

    // 1. Click nút xóa
    ProductPage.clickDeleteProduct(updatedData.title);

    // 2. Xử lý Confirm Dialog
    cy.on('window:confirm', (text) => {
      expect(text).to.equal("Bạn có chắc chắn muốn xóa sản phẩm này không?");
      return true; // Bấm OK
    });

    // 3. Verify Alert
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Đã xóa');
    });

    // 4. Verify sản phẩm biến mất khỏi bảng
    ProductPage.verifyProductNotVisible(updatedData.title);
  });

});