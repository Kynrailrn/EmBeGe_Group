const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Default XAMPP
  password: '',      // Default XAMPP kosong
  database: 'embege',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();