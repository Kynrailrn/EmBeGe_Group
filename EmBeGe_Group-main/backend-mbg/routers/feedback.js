const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('photo'), async (req, res) => {
  const { rating, comment } = req.body;
  const photo = req.file ? req.file.filename : null;

  const isUrgent = rating <= 2;

  await db.query(
    `INSERT INTO feedbacks (user_id, rating, comment, photo, is_urgent)
     VALUES (?, ?, ?, ?, ?)`,
    [1, rating, comment, photo, isUrgent]
  );

  res.json({ message: 'Feedback berhasil dikirim' });
});

router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM feedbacks');
  res.json(rows);
});

router.get('/urgent', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM feedbacks WHERE is_urgent = TRUE'
  );
  res.json(rows);
});

module.exports = router;