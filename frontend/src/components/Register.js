import React, { useState } from "react";

const Register = ({ onRegisterSuccess }) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    console.log("Tombol register diklik");
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password }),
      });

      console.log("Response dari backend:", response);

      if (!response.ok) {
        throw new Error("Gagal melakukan registrasi");
      }

      const data = await response.json();
      console.log("Data dari backend:", data);

      if (data.message === "Registrasi berhasil") {
        alert("Registrasi berhasil!");
        onRegisterSuccess(); // Panggil callback function untuk handle registrasi success
      } else {
        alert("Gagal melakukan registrasi");
      }
    } catch (error) {
      console.error("Error saat fetch:", error);
      alert("Terjadi kesalahan saat registrasi: " + error.message);
    }
  };

  return (
    <div>
      <h2>Registrasi Karyawan Baru</h2>
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
      <button onClick={handleRegister}>Register</button>
      <button onClick={() => onRegisterSuccess()}>Kembali ke Login</button>
    </div>
  );
};

export default Register;
