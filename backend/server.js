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
  laporan: 'feedbacks' // (Catatan: rute post/get laporan akan ter-handle oleh blok manual di atas)
};

Object.keys(tableMap).forEach(route => {
  const tableName = tableMap[route];

  // READ (Ambil Semua Data)
  app.get(`/api/${route}`, async (req, res) => {
    // Abaikan jika route adalah laporan, karena sudah di-handle di atas
    if(route === 'laporan') return; 

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

  // CREATE (Tambah Data Baru)
  app.post(`/api/${route}`, async (req, res) => {
    // Abaikan jika route adalah laporan, karena sudah di-handle manual (dengan multer)
    if(route === 'laporan') return;

    try {
      const data = req.body;
      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Data tidak boleh kosong" });
      }
      const [result] = await db.query(`INSERT INTO ?? SET ?`, [tableName, data]);
      res.status(201).json({ 
        message: `Data di ${route} berhasil ditambahkan`,
        id: result.insertId, 
        ...data 
      });
    } catch (err) {
      console.error(`Error POST /api/${route}:`, err.message);
      res.status(500).json({ error: "Gagal menambah data" });
    }
  });

  // UPDATE (Edit Data berdasarkan ID)
  app.put(`/api/${route}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, data, id]);
      res.json({ message: `Data di ${route} berhasil diperbarui` });
    } catch (err) {
      console.error(`Error PUT /api/${route}:`, err.message);
      res.status(500).json({ error: "Gagal memperbarui data" });
    }
  });

  // DELETE (Hapus Data berdasarkan ID)
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

// --- Middleware Error 404 Custom (Penangkap Rute yang Tidak Ada) ---
app.use((req, res) => {
  res.status(404).json({ error: "Rute API tidak ditemukan" });
});

// --- 4. START SERVER ---
db.getConnection()
  .then((conn) => {
    console.log('✅ Database Terhubung!');
    conn.release(); 
  })
  .catch((err) => {
    console.error('❌ Gagal Konek Database:', err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend jalan di port ${PORT}`));