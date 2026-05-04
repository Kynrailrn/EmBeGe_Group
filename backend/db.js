const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'embege' // Pastikan nama DB lu sama kayak di phpMyAdmin
}).promise();

module.exports = db;