import React, { useEffect, useState } from "react";

const AdminPanel = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Ambil data karyawan dan absensi
  useEffect(() => {
    fetch("http://localhost:3000/admin/karyawan")
      .then((response) => response.json())
      .then((data) => setKaryawan(data));

    fetch("http://localhost:3000/admin/absensi")
      .then((response) => response.json())
      .then((data) => setAbsensi(data));
  }, []);

  // Tambah karyawan baru
  const handleTambahKaryawan = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/karyawan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan karyawan");
      }

      const data = await response.json();
      alert(data.message);
      setKaryawan([...karyawan, { id: data.id, nama, email, password }]); // Perbarui state karyawan
      setNama(""); // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan karyawan: " + error.message);
    }
  };

  // Update karyawan
  const handleUpdateKaryawan = (id) => {
    const karyawanToUpdate = karyawan.find((k) => k.id === id);
    if (karyawanToUpdate) {
      const newNama = prompt("Masukkan nama baru:", karyawanToUpdate.nama);
      const newEmail = prompt("Masukkan email baru:", karyawanToUpdate.email);
      const newPassword = prompt(
        "Masukkan password baru:",
        karyawanToUpdate.password
      );

      if (newNama && newEmail && newPassword) {
        fetch(`http://localhost:3000/admin/karyawan/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: newNama,
            email: newEmail,
            password: newPassword,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            // Perbarui state karyawan
            setKaryawan(
              karyawan.map((k) =>
                k.id === id
                  ? {
                      ...k,
                      nama: newNama,
                      email: newEmail,
                      password: newPassword,
                    }
                  : k
              )
            );
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengupdate karyawan");
          });
      }
    }
  };

  // Hapus karyawan
  const handleHapusKaryawan = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      fetch(`http://localhost:3000/admin/karyawan/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          // Perbarui state karyawan
          setKaryawan(karyawan.filter((k) => k.id !== id));
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Terjadi kesalahan saat menghapus karyawan");
        });
    }
  };

  // Fungsi untuk mendapatkan nama karyawan berdasarkan karyawan_id
  const getNamaKaryawan = (karyawan_id) => {
    const karyawanData = karyawan.find((k) => k.id === karyawan_id);
    return karyawanData ? karyawanData.nama : "Karyawan Tidak Ditemukan";
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Tambah Karyawan Baru</h3>
      <input
        type="text"
        placeholder="Nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleTambahKaryawan}>Tambah Karyawan</button>

      <h3>Daftar Karyawan</h3>
      <ul>
        {karyawan.map((k) => (
          <li key={k.id}>
            {k.nama} - {k.email}
            <button onClick={() => handleUpdateKaryawan(k.id)}>Update</button>
            <button onClick={() => handleHapusKaryawan(k.id)}>Hapus</button>
          </li>
        ))}
      </ul>

      <h3>Daftar Absensi</h3>
      <ul>
        {absensi.map((a) => (
          <li key={a.id}>
            <strong>Nama Karyawan:</strong> {getNamaKaryawan(a.karyawan_id)} |{" "}
            <strong>Tanggal:</strong> {a.tanggal} | <strong>Waktu:</strong>{" "}
            {a.waktu}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
