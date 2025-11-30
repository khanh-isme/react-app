import ProductPage from '../support/pages/ProductPage';
// Kiểm tra lại đường dẫn import này, thường là ../support/pages/LoginPage
import { loginPage } from '../e2e/pages/LoginPage'; 

describe('6.2.2 Product CRUD Operations', () => {
  
  const productData = {
    title: `Sản phẩm Test E2E ${Date.now()}`,
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

  // --- QUAN TRỌNG: THÊM ĐOẠN NÀY ĐỂ TẠO USER TRÊN GITHUB ACTIONS ---
  before(() => {
    cy.log('Seeding Data: Creating user k/1');
    
    // Gọi API Backend để tạo user "k" nếu chưa có
    // (Thay đổi URL '/api/auth/register' nếu backend bạn dùng đường dẫn khác)
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/register', 
      failOnStatusCode: false, // Bỏ qua lỗi nếu user đã tồn tại (khi chạy local)
      body: {
        username: "k",
        password: "1",
        // Thêm email hoặc các trường khác nếu Model User của bạn yêu cầu bắt buộc
      }
    });
  });
  // -------------------------------------------------------------------

  beforeEach(() => {
    // 1. Đăng nhập với user vừa tạo
    loginPage.visit();
    loginPage.login("k", "1"); 
    
    // Chờ redirect (quan trọng)
    // Đảm bảo URL không còn chứa '/login' nữa
    cy.url().should('not.include', '/login'); 
    
    // 2. Vào trang quản lý
    ProductPage.visit();
  });

  // --- a) Test Create ---
  it('a) Create: Nên thêm mới sản phẩm thành công', () => {
    ProductPage.openCreateModal();
    ProductPage.fillForm(productData);
    ProductPage.submit();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('thành công');
    });

    ProductPage.elements.modal().should('not.exist');
  });

  // --- b) Test Read ---
  it('b) Read: Sản phẩm vừa tạo phải xuất hiện trong danh sách', () => {
    ProductPage.verifyProductVisible(productData.title);
    cy.contains('tr', productData.title).should('contain', '200.000');
    cy.contains('tr', productData.title).should('contain', productData.category);
  });

  // --- c) Test Update ---
  it('c) Update: Nên cập nhật thông tin sản phẩm thành công', () => {
    ProductPage.clickEditProduct(productData.title);

    // Verify data cũ load lên đúng
    ProductPage.elements.titleInput().should('have.value', productData.title);

    // Sửa form
    ProductPage.fillForm({
      title: updatedData.title,
      price: updatedData.price,
      description: updatedData.description
    });

    ProductPage.submit();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('thành công'); // Alert cập nhật cũng thường chứa chữ 'thành công'
    });

    ProductPage.verifyProductVisible(updatedData.title);
  });

  // --- e) Test Search ---
  it('e) Search: Nên tìm kiếm được sản phẩm theo tên', () => {
    ProductPage.searchProduct(updatedData.title);
    ProductPage.verifyProductVisible(updatedData.title);

    ProductPage.searchProduct('Tên Rác 123');
    cy.contains('td', 'Không tìm thấy').should('be.visible'); // Hoặc message tương tự trong code bạn
  });

  // --- d) Test Delete ---
  it('d) Delete: Nên xóa sản phẩm thành công', () => {
    // Reset thanh tìm kiếm để hiện lại sản phẩm
    // Nếu hàm searchProduct trong POM đã xử lý keyword rỗng thì dùng: ProductPage.searchProduct('');
    // Nếu chưa xử lý, dùng dòng dưới:
    ProductPage.elements.searchInput().clear(); 
    cy.wait(500);

    ProductPage.clickDeleteProduct(updatedData.title);

    cy.on('window:confirm', () => true);

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Đã xóa');
    });

    ProductPage.verifyProductNotVisible(updatedData.title);
  });

});