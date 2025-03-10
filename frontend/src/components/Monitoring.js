import React, { useEffect, useState } from "react";

const Monitoring = ({ karyawanId, refreshData }) => {
  const [absensi, setAbsensi] = useState([]);

  // Ambil data absensi milik user tertentu
  useEffect(() => {
    fetch(`http://localhost:3000/absensi/${karyawanId}`)
      .then((response) => response.json())
      .then((data) => setAbsensi(data));
  }, [karyawanId, refreshData]); // Dependency: karyawanId dan refreshData

  return (
    <div>
      <h2>Monitoring Absensi</h2>
      <h3>Data Absensi</h3>
      <ul>
        {absensi.map((a) => (
          <li key={a.id}>
            <strong>Tanggal:</strong> {a.tanggal} | <strong>Waktu:</strong>{" "}
            {a.waktu}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Monitoring;
