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
    const schedule_id = 1; 
    const foto = req.file ? req.file.path : null;
    
    const sql = 'INSERT INTO feedbacks (user_id, schedule_id, rating, komentar, foto_bukti_url) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [user_id || 1, schedule_id, rating || 0, komentar, foto]);
    res.json({ message: "Berhasil simpan laporan!" });
  } catch (err) {
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});

// --- BAGIAN YANG DITAMBAHKAN UNTUK FIX EDIT LAPORAN BISA UPLOAD GAMBAR ---
app.put('/api/laporan/:id', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, komentar } = req.body;
    const foto = req.file ? req.file.path : null;

    let sql = 'UPDATE feedbacks SET rating = ?, komentar = ?';
    let params = [rating || 0, komentar];

    // Jika user upload foto baru saat diedit, update juga fotonya
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
// ------------------------------------------------------------------------

const tableMap = {
  menu: 'menus',
  siswa: 'students',
  sekolah: 'users',
  jadwal: 'schedules',
  laporan: 'feedbacks'
};

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
          GROUP BY s.id, u.id, m.id, s.tanggal, m.nama_menu, u.nama
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
      const data = req.body;
      if (Object.keys(data).length === 0) return res.status(400).json({ error: "Data tidak boleh kosong" });
      const [result] = await db.query(`INSERT INTO ?? SET ?`, [tableName, data]);
      res.status(201).json({ message: `Berhasil`, id: result.insertId, ...data });
    } catch (err) {
      res.status(500).json({ error: "Gagal menambah data" });
    }
  });

  app.put(`/api/${route}/:id`, async (req, res) => {
    if(route === 'laporan') return; // FIX: Biar laporan gak masuk ke fungsi update bawaan ini
    try {
      const { id } = req.params;
      const data = req.body;
      await db.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, data, id]);
      res.json({ message: `Berhasil` });
    } catch (err) {
      res.status(500).json({ error: "Gagal" });
    }
  });

  app.delete(`/api/${route}/:id`, async (req, res) => {
    // Kalau mau ada pengecualian laporan pas di delete, bisa ditambahin if (route === 'laporan') return;
    // Tapi karena hapus laporan cuma butuh ID dan ga butuh multer, aman aja dilewat generic.
    try {
      const { id } = req.params;
      await db.query(`DELETE FROM ?? WHERE id = ?`, [tableName, id]);
      res.json({ message: "Berhasil" });
    } catch (err) {
      res.status(500).json({ error: "Gagal" });
    }
  });
});

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

// --- 4. START SERVER ---
db.getConnection().then(() => console.log('✅ Database Terhubung!'));
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`🚀 Backend jalan di port ${PORT}`));