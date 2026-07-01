const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'embege',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

app.get('/api/laporan', async (req, res) => {
  try {
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
    const schedule_id = 3; 
    const foto = req.file ? req.file.path : null;
    console.log("Values to insert:", [user_id || 1, schedule_id, rating || 0, komentar, foto]);
    
    const sql = 'INSERT INTO feedbacks (user_id, schedule_id, rating, komentar, foto_bukti_url) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [user_id || 1, schedule_id, rating || 0, komentar, foto]);
    res.json({ message: "Berhasil simpan laporan!" });
  } catch (err) {
    console.error("DETAIL ERROR SQL:", err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});

app.put('/api/laporan/:id', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, komentar } = req.body;
    const foto = req.file ? req.file.path : null;

    let sql = 'UPDATE feedbacks SET rating = ?, komentar = ?';
    let params = [rating || 0, komentar];

    if (foto) {
      sql += ', foto_bukti_url = ?';
      params.push(foto);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await db.query(sql, params);
    res.json({ message: "Berhasil update laporan!" });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});

const tableMap = {
  menu: 'menus',
  siswa: 'students',
  sekolah: 'users',
  jadwal: 'schedules',
  laporan: 'feedbacks'
};

// Kolom yang boleh masuk ke tabel schedules — field lain dibuang
const JADWAL_ALLOWED_FIELDS = ['tanggal', 'menu_id', 'sekolah_id', 'status'];

Object.keys(tableMap).forEach(route => {
  const tableName = tableMap[route];

  app.get(`/api/${route}`, async (req, res) => {
    if(route === 'laporan') return; 

    try {
      if (route === 'jadwal') {
        const query = `
          SELECT 
            s.id AS id, 
            s.tanggal,
            s.status,
            m.id AS menu_id,
            m.nama_menu,
            u.id AS sekolah_id,
            u.nama AS nama_sekolah,
            COUNT(st.id) AS jumlah_porsi
          FROM schedules s
          LEFT JOIN menus m ON s.menu_id = m.id
          INNER JOIN users u ON s.sekolah_id = u.id 
          LEFT JOIN students st ON u.id = st.sekolah_id
          WHERE u.role = 'sekolah'
          GROUP BY s.id, u.id, m.id, s.tanggal, s.status, m.nama_menu, u.nama
          ORDER BY s.tanggal DESC, u.nama ASC
        `;
        const [rows] = await db.query(query);
        return res.json(rows);
      }

      let query = `SELECT * FROM ??`;
      let params = [tableName];

      if (route === 'sekolah') {
        query = `SELECT * FROM ?? WHERE role != 'admin'`;
      } else if (route === 'siswa') {
        query = `SELECT * FROM ?? ORDER BY nama_siswa ASC`;
      }

      const [rows] = await db.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  app.post(`/api/${route}`, async (req, res) => {
    if(route === 'laporan') return;
    try {
      let data = { ...req.body };
      
      if (route === 'jadwal') {
        // Hanya izinkan kolom yang ada di tabel schedules
        const filtered = {};
        JADWAL_ALLOWED_FIELDS.forEach(f => {
          if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
            filtered[f] = data[f];
          }
        });
        // Pastikan status default jika tidak dikirim
        if (!filtered.status) filtered.status = 'Belum Siap';
        data = filtered;
      } else {
        // Halaman lain: buang field titipan umum
        delete data.jumlah_porsi;
        delete data.nama_sekolah;
        if (route !== 'menu') delete data.nama_menu;
      }

      if (Object.keys(data).length === 0) return res.status(400).json({ error: "Data tidak boleh kosong" });
      const [result] = await db.query(`INSERT INTO ?? SET ?`, [tableName, data]);
      res.status(201).json({ message: `Berhasil`, id: result.insertId, ...data });
    } catch (err) {
      console.error("Error POST:", err.sqlMessage || err.message);
      res.status(500).json({ message: err.sqlMessage || "Gagal menambah data" });
    }
  });

  app.put(`/api/${route}/:id`, async (req, res) => {
    if(route === 'laporan') return; 
    try {
      const { id } = req.params;
      let data = { ...req.body };

      // TAMBAHKAN INI SEMENTARA UNTUK DEBUG
      if (route === 'jadwal') {
        console.log('=== DEBUG PUT JADWAL ===');
        console.log('ID:', id);
        console.log('Body yang diterima:', JSON.stringify(req.body, null, 2));
      }

      if (route === 'jadwal') {
        // Hanya izinkan kolom yang ada di tabel schedules
        const filtered = {};
        JADWAL_ALLOWED_FIELDS.forEach(f => {
          if (data[f] !== undefined && data[f] !== null && data[f] !== '') {
            filtered[f] = data[f];
          }
        });
        data = filtered;
      } else {
        // Halaman lain: buang field titipan umum
        delete data.jumlah_porsi;
        delete data.nama_sekolah;
        if (route !== 'menu') delete data.nama_menu;
      }

      if (Object.keys(data).length === 0) return res.status(400).json({ error: "Tidak ada data yang diupdate" });
      await db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, data, id]);
      res.json({ message: `Berhasil` });
    } catch (err) {
      console.error("Error PUT:", err.sqlMessage || err.message);
      res.status(500).json({ message: err.sqlMessage || "Gagal update data" });
    }
  });

 // ... (lanjutkan dari kode di atas tepat sebelum bagian tableMap atau app.post login)

  app.delete(`/api/${route}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Menghapus ID ${id} dari tabel ${tableName}`);
    
    // Melakukan penghapusan
    await db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, id]);
    
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    // INI BAGIAN PALING PENTING: Mencetak error asli ke terminal
    console.error("[DEBUG ERROR DATABASE]:", err.sqlMessage || err.message);
    res.status(500).json({ error: err.sqlMessage || "Gagal hapus data" });
  }
});
}); // <--- INI PENTING: Menutup forEach(tableMap)

// Pastikan bagian login ada di luar forEach
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ? AND password_hash = ?`, [email, password]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(401).json({ error: "Salah" });
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});

db.getConnection().then(() => console.log('✅ Database Terhubung!'));
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Backend jalan di port ${PORT}`));