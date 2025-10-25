import mysql from 'mysql2';

// Tạo connection pool (nên dùng pool thay vì connection đơn lẻ)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: '123456789', 
  database: 'facebook',   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Dùng promise để tiện await
const promisePool = pool.promise();

export default promisePool;
