import React, { useState } from "react";

const Absensi = ({ karyawanId, onAbsenSuccess }) => {
  const [foto, setFoto] = useState(null);

  const handleAbsensi = async () => {
    console.log("Tombol absensi diklik");
    try {
      const formData = new FormData();
      formData.append("karyawan_id", karyawanId);
      formData.append("tanggal", new Date().toISOString().split("T")[0]); // Format: YYYY-MM-DD
      formData.append("waktu", new Date().toTimeString().split(" ")[0]); // Format: HH:MM:SS
      formData.append("foto", foto); // File foto

      console.log("Data yang dikirim:", {
        karyawan_id: karyawanId,
        tanggal: new Date().toISOString().split("T")[0],
        waktu: new Date().toTimeString().split(" ")[0],
        foto: foto,
      });

      const response = await fetch("http://localhost:3000/absensi", {
        method: "POST",
        body: formData,
      });

      console.log("Response dari backend:", response);

      if (!response.ok) {
        throw new Error("Gagal melakukan absensi");
      }

      const data = await response.json();
      console.log("Data dari backend:", data);

      if (data.message === "Absensi berhasil disimpan") {
        alert("Absensi berhasil disimpan!");
        onAbsenSuccess(); // Panggil callback function untuk memperbarui data
      } else {
        alert("Gagal menyimpan absensi");
      }
    } catch (error) {
      console.error("Error saat fetch:", error);
      alert("Terjadi kesalahan saat absensi: " + error.message);
    }
  };

  return (
    <div>
      <h2>Absensi WFH</h2>
      <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
      <button onClick={handleAbsensi}>Submit Absensi</button>
    </div>
  );
};

export default Absensi;
