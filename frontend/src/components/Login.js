import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Tombol login diklik");
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response dari backend:", response);

      // Periksa apakah respons adalah JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Respons tidak valid: ${text}`);
      }

      const data = await response.json();
      console.log("Data dari backend:", data);

      if (data.message === "Login berhasil") {
        alert("Login berhasil!");
        onLoginSuccess(data.karyawan); // Panggil callback function untuk handle login success
      } else {
        alert("Email atau password salah");
      }
    } catch (error) {
      console.error("Error saat fetch:", error);
      alert("Terjadi kesalahan saat login: " + error.message);
    }
  };

  return (
    <div>
      <h2>Login Karyawan</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
