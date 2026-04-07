const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',     
    database: 'embege'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke MySQL:', err.message);
    } else {
        console.log('Terhubung ke Database MySQL (embege)');
    }
});

// Pintu utama (Dashboard Server)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 20px;">
            <h1>🚀 Server MBG Berjalan!</h1>
            <p>Status: <span style="color: green; font-weight: bold;">Aktif</span></p>
            <hr>
            <h3>Endpoint API:</h3>
            <ul>
                <li><a href="/api/menu">/api/menu</a> - Data Menu</li>
                <li><a href="/api/laporan">/api/laporan</a> - Data Laporan</li>
            </ul>
        </div>
    `);
});

// ==================== API MENU ====================

// 1. Ambil Semua Menu (Diperbaiki: ORDER BY id agar tidak error)
app.get('/api/menu', (req, res) => {
    db.query('SELECT * FROM menus ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Tambah Menu Baru
app.post('/api/menu', (req, res) => {
    const { nama_menu, deskripsi, kalori, protein, status } = req.body;
    const sql = 'INSERT INTO menus (nama_menu, deskripsi, kalori, protein, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nama_menu, deskripsi, kalori, protein, status], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Menu ditambahkan!', id: result.insertId });
    });
});

// 3. Hapus Menu
app.delete('/api/menu/:id', (req, res) => {
    db.query('DELETE FROM menus WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Menu dihapus' });
    });
});

// ==================== API LAPORAN ====================

// 1. Ambil Laporan
app.get('/api/laporan', (req, res) => {
    db.query('SELECT * FROM reports ORDER BY tanggal DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Tambah Laporan
app.post('/api/laporan', (req, res) => {
    const { tanggal, nama_sekolah, jumlah_porsi, status, keterangan } = req.body;
    const sql = 'INSERT INTO reports (tanggal, nama_sekolah, jumlah_porsi, status, keterangan) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [tanggal, nama_sekolah, jumlah_porsi, status, keterangan], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Laporan berhasil ditambahkan', id: result.insertId });
    });
});

// 3. Hapus Laporan
app.delete('/api/laporan/:id', (req, res) => {
    db.query('DELETE FROM reports WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Laporan dihapus' });
    });
});

// Jalankan Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));