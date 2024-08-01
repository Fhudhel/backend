const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kehadiran'
});

// Menghubungkan ke database MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint untuk menerima data kehadiran
app.post('/submit-attendance', (req, res) => {
    const { name, attendance } = req.body;

    // Validasi input
    if (!name || !attendance || (attendance !== 'Hadir' && attendance !== 'Tidak Hadir')) {
        return res.status(400).json({ message: 'Data tidak valid!' });
    }

    const query = 'INSERT INTO attendance (name, attendance) VALUES (?, ?)';
    db.query(query, [name, attendance], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal menyimpan data!' });
        }
        res.json({ message: 'Data berhasil disimpan!' });
    });
});

// Endpoint untuk mendapatkan data kehadiran
app.get('/get-attendance', (req, res) => {
    const query = 'SELECT * FROM attendance';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal mengambil data!' });
        }
        res.json(results);
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
