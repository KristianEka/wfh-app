const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Koneksi ke database
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin", // Ganti dengan username MySQL Anda
  password: "root", // Ganti dengan password MySQL Anda
  database: "wfh_app",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Route untuk testing
app.get("/", (req, res) => {
  res.send("Aplikasi Absensi WFH Karyawan");
});

// Route login
app.post("/login", (req, res) => {
  console.log("Request login diterima:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  const query = "SELECT * FROM karyawan WHERE email = ? AND password = ?";
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    if (results.length > 0) {
      console.log("Login berhasil untuk karyawan:", results[0]);
      res.json({ message: "Login berhasil", karyawan: results[0] });
    } else {
      console.log("Login gagal: Email atau password salah");
      res.status(401).json({ message: "Email atau password salah" });
    }
  });
});

// Route untuk registrasi karyawan baru
app.post("/register", (req, res) => {
  console.log("Request registrasi diterima:", req.body);
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }

  const query = "INSERT INTO karyawan (nama, email, password) VALUES (?, ?, ?)";
  connection.query(query, [nama, email, password], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    console.log("Registrasi berhasil:", results);
    res.json({ message: "Registrasi berhasil", id: results.insertId });
  });
});

// Route untuk absensi
app.post("/absensi", upload.single("foto"), (req, res) => {
  console.log("Request absensi diterima:", req.body);
  const { karyawan_id, tanggal, waktu } = req.body;
  const foto = req.file ? req.file.path : null; // Path file yang diupload

  if (!karyawan_id || !tanggal || !waktu || !foto) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const query =
    "INSERT INTO absensi (karyawan_id, tanggal, waktu, foto) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [karyawan_id, tanggal, waktu, foto],
    (err, results) => {
      if (err) {
        console.error("Error query database:", err);
        return res.status(500).json({ error: "Terjadi kesalahan di server" });
      }

      console.log("Absensi berhasil disimpan:", results);
      res.json({ message: "Absensi berhasil disimpan", id: results.insertId });
    }
  );
});

// Route untuk mendapatkan data absensi milik user tertentu
app.get("/absensi/:karyawan_id", (req, res) => {
  const { karyawan_id } = req.params;

  const query = "SELECT * FROM absensi WHERE karyawan_id = ?";
  connection.query(query, [karyawan_id], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    // Format tanggal dan waktu
    const formattedResults = results.map((absensi) => ({
      ...absensi,
      tanggal: new Date(absensi.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      waktu: new Date(`1970-01-01T${absensi.waktu}`).toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    }));

    res.json(formattedResults);
  });
});

app.get("/admin/absensi", (req, res) => {
  const query = "SELECT * FROM absensi";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    // Format tanggal dan waktu
    const formattedResults = results.map((absensi) => ({
      ...absensi,
      tanggal: new Date(absensi.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      waktu: new Date(`1970-01-01T${absensi.waktu}`).toLocaleTimeString(
        "id-ID",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      karyawan_id: absensi.karyawan_id,
    }));

    res.json(formattedResults);
  });
});

// Route untuk mendapatkan semua data karyawan (admin only)
app.get("/admin/karyawan", (req, res) => {
  const query = "SELECT * FROM karyawan";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }
    res.json(results);
  });
});

// Route untuk menambah karyawan baru (admin only)
app.post("/admin/karyawan", (req, res) => {
  console.log("Request tambah karyawan diterima:", req.body);
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }

  const query = "INSERT INTO karyawan (nama, email, password) VALUES (?, ?, ?)";
  connection.query(query, [nama, email, password], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    console.log("Karyawan berhasil ditambahkan:", results);
    res.json({
      message: "Karyawan berhasil ditambahkan",
      id: results.insertId,
    });
  });
});

// Route untuk mengupdate data karyawan (admin only)
app.put("/admin/karyawan/:id", (req, res) => {
  console.log("Request update karyawan diterima:", req.body);
  const { id } = req.params;
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nama, email, dan password harus diisi" });
  }

  const query =
    "UPDATE karyawan SET nama = ?, email = ?, password = ? WHERE id = ?";
  connection.query(query, [nama, email, password, id], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    console.log("Karyawan berhasil diupdate:", results);
    res.json({ message: "Karyawan berhasil diupdate" });
  });
});

// Route untuk menghapus data karyawan (admin only)
app.delete("/admin/karyawan/:id", (req, res) => {
  console.log("Request delete karyawan diterima:", req.params);
  const { id } = req.params;

  const query = "DELETE FROM karyawan WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error query database:", err);
      return res.status(500).json({ error: "Terjadi kesalahan di server" });
    }

    console.log("Karyawan berhasil dihapus:", results);
    res.json({ message: "Karyawan berhasil dihapus" });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
