const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Tambahan untuk cek folder
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Agar bisa baca data form-url-encoded

// Pastikan folder 'uploads' ada, kalau tidak ada kita buat otomatis
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static('uploads'));

// --- KONFIGURASI MULTER (UPLOAD FOTO) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- KONEKSI DATABASE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'embege'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal koneksi MySQL:', err.message);
    } else {
        console.log('✅ Terhubung ke Database MySQL (embege)');
    }
});

// --- DASHBOARD SERVER ---
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 20px;">
            <h1>🚀 Server MBG (Backend) Aktif!</h1>
            <p>Status: <span style="color: green;">Running on Port 3000</span></p>
            <hr>
            <h3>Cek API:</h3>
            <ul>
                <li><a href="/api/menu">/api/menu</a></li>
                <li><a href="/api/laporan">/api/laporan</a></li>
            </ul>
        </div>
    `);
});

// ==================== API MENU ====================
app.get('/api/menu', (req, res) => {
    db.query('SELECT * FROM menus ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/menu', (req, res) => {
    const { nama_menu, deskripsi, kalori, protein, status } = req.body;
    const sql = 'INSERT INTO menus (nama_menu, deskripsi, kalori, protein, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nama_menu, deskripsi, kalori, protein, status], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Menu ditambahkan!', id: result.insertId });
    });
});

// ==================== API LAPORAN (WITH UPLOAD & EMERGENCY) ====================

// 1. Ambil Laporan
app.get('/api/laporan', (req, res) => {
    db.query('SELECT * FROM reports ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Tambah Laporan + Upload Foto + Logic Penandaan Otomatis
app.post('/api/laporan', upload.single('foto'), (req, res) => {
    console.log("📥 Data Laporan Masuk:", req.body); // Untuk cek di terminal
    
    const { tanggal, nama_sekolah, jumlah_porsi, rating, komentar } = req.body;
    const foto_bukti = req.file ? req.file.filename : null;
    
    // LOGIKA OTOMATIS: Jika rating <= 2, set is_emergency = 1
    const ratInt = parseInt(rating) || 5;
    const is_emergency = ratInt <= 2 ? 1 : 0;
    const status = is_emergency ? 'Pending' : 'Terkirim';

    const sql = `INSERT INTO reports 
                 (tanggal, nama_sekolah, jumlah_porsi, status, rating, komentar, foto_bukti, is_emergency) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [tanggal, nama_sekolah, jumlah_porsi, status, ratInt, komentar, foto_bukti, is_emergency], (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("✅ Laporan Berhasil Disimpan. Emergency:", is_emergency);
        res.json({ 
            message: 'Laporan berhasil diproses', 
            id: result.insertId,
            emergency: is_emergency 
        });
    });
});

// 3. Hapus Laporan
app.delete('/api/laporan/:id', (req, res) => {
    db.query('DELETE FROM reports WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Laporan dihapus' });
    });
});

// Jalankan Server
app.listen(3000, () => {
    console.log('-----------------------------------------');
    console.log('🚀 Server running on http://localhost:3000');
    console.log('-----------------------------------------');
});