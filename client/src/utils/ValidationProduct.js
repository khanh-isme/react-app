export const validateProduct = (product, validCategories = []) => {
  const errors = {};

  // --- 1. Validate Product Name (title) ---
  const title = product.title ? String(product.title).trim() : "";

  if (!title) {
    errors.title = "Tên sản phẩm không được để trống.";
  } else if (title.length < 3) {
    errors.title = "Tên sản phẩm phải có tối thiểu 3 ký tự.";
  } else if (title.length > 100) {
    errors.title = "Tên sản phẩm tối đa 100 ký tự.";
  }
  // Kiểm tra ký tự đặc biệt (Tùy chọn: chỉ cho phép chữ, số, khoảng trắng, gạch ngang, ngoặc đơn)
  // Regex này chặn các ký tự lạ như @, #, $, %, ^, &, *...
  else if (!/^[a-zA-Z0-9\s\-\(\)\.]+$/u.test(title)) {
    errors.title = "Tên sản phẩm chứa ký tự đặc biệt không hợp lệ.";
  }

  // --- 2. Validate Price ---
  // Chuyển sang số để kiểm tra
  const price = Number(product.price);

  if (
    product.price === null ||
    product.price === undefined ||
    String(product.price).trim() === ""
  ) {
    errors.price = "Giá sản phẩm không được để trống.";
  } else if (isNaN(price)) {
    errors.price = "Giá sản phẩm phải là số.";
  } else if (price <= 0) {
    errors.price = "Giá sản phẩm phải lớn hơn 0.";
  } else if (price > 999999999) {
    errors.price = "Giá sản phẩm quá lớn (Tối đa 999,999,999).";
  }

  // --- 3. Validate Quantity (stock) ---
  // Lưu ý: Trong schema của bạn là 'stock', yêu cầu là 'Quantity'
  const stock = Number(product.stock);

  if (
    product.stock === null ||
    product.stock === undefined ||
    String(product.stock).trim() === ""
  ) {
    errors.stock = "Số lượng không được để trống.";
  } else if (isNaN(stock)) {
    errors.stock = "Số lượng phải là số.";
  } else if (!Number.isInteger(stock)) {
    errors.stock = "Số lượng phải là số nguyên (không được lẻ).";
  } else if (stock < 0) {
    errors.stock = "Số lượng không được nhỏ hơn 0.";
  } else if (stock > 99999) {
    errors.stock = "Số lượng quá lớn (Tối đa 99,999).";
  }

  // --- 4. Validate Description ---
  const description = product.description
    ? String(product.description).trim()
    : "";

  // Description được phép rỗng, chỉ check max length nếu có nhập
  if (description.length > 500) {
    errors.description = "Mô tả không được vượt quá 500 ký tự.";
  }

  // --- 5. Validate Category ---
  const category = product.category ? String(product.category).trim() : "";

  if (!category) {
    errors.category = "Danh mục không được để trống.";
  } else if (
    validCategories.length > 0 &&
    !validCategories.includes(category)
  ) {
    // Kiểm tra xem category nhập vào có nằm trong list cho phép không
    errors.category = "Danh mục không hợp lệ (Phải chọn từ danh sách).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
