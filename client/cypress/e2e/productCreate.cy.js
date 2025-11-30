// 1. Import cả 2 Page Object
import ProductCreatePage from '../e2e/pages/ProductCreatePage';
import { loginPage } from '../e2e/pages/LoginPage'; // Import đúng tên export

describe('Product Create E2E', () => {
  
  beforeEach(() => {
    // --- BƯỚC 1: ĐĂNG NHẬP ---
    loginPage.visit(); // Vào trang login

    // Điền user/pass thật của bạn (User admin có quyền thêm sửa xóa)
    // Lưu ý: Đảm bảo user này tồn tại trong DB MongoDB của bạn
    loginPage.login("k", "1"); 

    // --- BƯỚC 2: CHỜ ĐĂNG NHẬP XONG ---
    // Chờ 2 giây để API login trả về token và lưu vào browser
    cy.wait(2000); 

    // --- BƯỚC 3: VÀO TRANG QUẢN LÝ ---
    ProductCreatePage.visit();
  });

  it('TC01 - Thêm sản phẩm thành công', () => {
    const newProduct = {
      title: 'Áo Thun Test E2E',
      price: '150000',
      category: 'Thời trang',
      sizes: 'S, M, L',
      description: 'Mô tả tự động từ Cypress'
    };

    // 1. Mở Modal (Lúc này đã login nên sẽ thấy nút thêm)
    ProductCreatePage.openCreateModal();

    // 2. Kiểm tra UI Modal (Optional - để chắc chắn modal hiện đúng)
    ProductCreatePage.elements.titleInput().should('be.visible');

    // 3. Điền form
    ProductCreatePage.fillForm(newProduct);

    // 4. Submit
    ProductCreatePage.submit();

    // 5. Verify Thành công
    cy.on('window:alert', (text) => {
      expect(text).to.contains('thành công');
    });
    
    // Đảm bảo modal đóng lại
    cy.get(".pfm-container").should('not.exist');
    
    // (Tùy chọn) Kiểm tra xem sản phẩm mới có hiện trong bảng không
    // cy.contains(newProduct.title).should('be.visible');
  });
});