const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi Database Embege
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'embege'
}).promise();

// Mapping rute API ke nama tabel di SQL kamu
const tableMap = {
  menu: 'menus',
  siswa: 'students',
  sekolah: 'users',
  jadwal: 'schedules',
  laporan: 'feedbacks'
};

// Endpoint otomatis untuk semua menu
Object.keys(tableMap).forEach(route => {
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ${tableMap[route]}`);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

db.getConnection()
  .then(() => console.log('✅ Database Embege Terhubung!'))
  .catch((err) => console.log('❌ Gagal Konek Database:', err));

app.listen(5000, () => console.log('🚀 Backend Embege Jalan di Port 5000'));