const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Koneksi Database
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'embege',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// --- 1. ENDPOINT MANUAL (Upload & Laporan) ---

app.get('/api/laporan', async (req, res) => {
  try {
    // Kita JOIN tabel feedbacks dengan users untuk dapet 'nama' sekolah
    const query = `
      SELECT feedbacks.*, users.nama AS nama_sekolah 
      FROM feedbacks 
      JOIN users ON feedbacks.user_id = users.id
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil data laporan" });
  }
});
app.post('/api/laporan', upload.single('foto'), async (req, res) => {
  try {
    const { user_id, rating, komentar } = req.body;
    const schedule_id = 1; 
    const foto = req.file ? req.file.path : null;
    
    const sql = 'INSERT INTO feedbacks (user_id, schedule_id, rating, komentar, foto_bukti_url) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [user_id || 1, schedule_id, rating || 0, komentar, foto]);
    
    res.json({ message: "Berhasil simpan laporan!" });
  } catch (err) {
    console.error("Error Detail:", err.sqlMessage || err.message);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});

// --- 2. LOGIKA CRUD OTOMATIS ---
const tableMap = {
  menu: 'menus',
  siswa: 'students',
  sekolah: 'users',
  jadwal: 'deliveries',
  laporan: 'feedbacks'
};

Object.keys(tableMap).forEach(route => {
  const tableName = tableMap[route];

  app.get(`/api/${route}`, async (req, res) => {
    try {
      let query = `SELECT * FROM ??`;
      let params = [tableName];
      if (route === 'sekolah') query = `SELECT * FROM ?? WHERE role != 'admin'`;
      const [rows] = await db.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  app.delete(`/api/${route}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      await db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, id]);
      res.json({ message: "Data berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: "Gagal menghapus data" });
    }
  });
});

// --- 3. LOGIN ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ? AND password_hash = ?`, [email, password]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(401).json({ error: "Email atau Password salah" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// --- 4. START SERVER ---
db.getConnection().then(() => console.log('✅ Database Terhubung!'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend jalan di port ${PORT}`));