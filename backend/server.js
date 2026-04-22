const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database dengan Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'embege',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Mapping rute API ke nama tabel
const tableMap = {
  menu: 'menus',
  siswa: 'students',
  sekolah: 'users',
  jadwal: 'schedules',
  laporan: 'feedbacks'
};

// --- LOGIKA CRUD OTOMATIS ---

Object.keys(tableMap).forEach(route => {
  const tableName = tableMap[route];

  // 1. READ (Ambil Semua Data)
  app.get(`/api/${route}`, async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ??`, [tableName]);
      res.json(rows);
    } catch (err) {
      console.error(`Error GET /api/${route}:`, err.message);
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  // 2. CREATE (Tambah Data)
  app.post(`/api/${route}`, async (req, res) => {
    try {
      const data = req.body;
      
      // Validasi sederhana: pastikan body tidak kosong
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Data tidak boleh kosong" });
      }

      const [result] = await db.query(`INSERT INTO ?? SET ?`, [tableName, data]);
      res.status(201).json({ 
        message: "Data berhasil ditambahkan",
        id: result.insertId, 
        ...data 
      });
    } catch (err) {
      console.error(`Error POST /api/${route}:`, err.message);
      // Jika error karena kolom tidak cocok, berikan pesan yang lebih jelas
      res.status(500).json({ error: err.sqlMessage || "Gagal menambah data" });
    }
  });

  // 3. DELETE (Hapus Data berdasarkan ID)
  app.delete(`/api/${route}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan" });
      }
      
      res.json({ message: `Data di ${route} berhasil dihapus` });
    } catch (err) {
      console.error(`Error DELETE /api/${route}:`, err.message);
      res.status(500).json({ error: "Gagal menghapus data" });
    }
  });

  // 4. UPDATE (Edit Data berdasarkan ID)
  app.put(`/api/${route}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const [result] = await db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, data, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Data tidak ditemukan untuk diupdate" });
      }
      
      res.json({ message: `Data di ${route} berhasil diperbarui` });
    } catch (err) {
      console.error(`Error PUT /api/${route}:`, err.message);
      res.status(500).json({ error: err.sqlMessage || "Gagal memperbarui data" });
    }
  });
});

// --- CEK KONEKSI & JALANKAN SERVER ---

db.getConnection()
  .then((conn) => {
    console.log('✅ Database Embege Terhubung!');
    conn.release(); // Kembalikan koneksi ke pool
  })
  .catch((err) => {
    console.error('❌ Gagal Konek Database:');
    console.error('Detail Error:', err.message);
  });

// Handle 404 untuk rute yang tidak ada
app.use((req, res) => {
  res.status(404).json({ error: "Rute API tidak ditemukan" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend Embege Jalan di Port ${PORT}`));