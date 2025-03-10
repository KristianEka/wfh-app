import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Absensi from "./components/Absensi";
import Monitoring from "./components/Monitoring";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [karyawan, setKaryawan] = useState(null);
  const [refreshData, setRefreshData] = useState(false); // State untuk memicu pembaruan data
  const [showRegister, setShowRegister] = useState(false); // State untuk menampilkan form registrasi
  const [isAdmin, setIsAdmin] = useState(false); // State untuk cek apakah user adalah admin

  // Cek local storage saat komponen pertama kali di-render
  useEffect(() => {
    const storedKaryawan = localStorage.getItem("karyawan");
    if (storedKaryawan) {
      const karyawanData = JSON.parse(storedKaryawan);
      setKaryawan(karyawanData);
      if (karyawanData.email === "admin@example.com") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLoginSuccess = (karyawan) => {
    setKaryawan(karyawan);
    localStorage.setItem("karyawan", JSON.stringify(karyawan)); // Simpan data login di local storage
    if (karyawan.email === "admin@example.com") {
      setIsAdmin(true);
    }
  };

  const handleAbsenSuccess = () => {
    setRefreshData((prev) => !prev); // Toggle state untuk memicu useEffect di Monitoring
  };

  const handleLogout = () => {
    localStorage.removeItem("karyawan"); // Hapus data login dari local storage
    setKaryawan(null); // Set state karyawan menjadi null
    setIsAdmin(false); // Set state admin menjadi false
  };

  const handleRegisterSuccess = () => {
    alert("Registrasi berhasil! Silakan login.");
    setShowRegister(false); // Sembunyikan form registrasi setelah berhasil
  };

  return (
    <div>
      {/* Tombol logout selalu muncul jika pengguna sudah login */}
      {karyawan && (
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}

      {!karyawan ? (
        <>
          {showRegister ? (
            <Register onRegisterSuccess={handleRegisterSuccess} />
          ) : (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <button onClick={() => setShowRegister(true)}>Register</button>
            </>
          )}
        </>
      ) : isAdmin ? (
        <AdminPanel />
      ) : (
        <>
          <Absensi
            karyawanId={karyawan.id}
            onAbsenSuccess={handleAbsenSuccess}
          />
          <Monitoring karyawanId={karyawan.id} refreshData={refreshData} />
        </>
      )}
    </div>
  );
}

export default App;
