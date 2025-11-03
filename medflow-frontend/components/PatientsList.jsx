'use client';
import { useEffect, useState } from 'react';
import { API_URL } from '../lib/api';
import { getToken } from '../lib/auth';

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const token = getToken();
    fetch(`${API_URL}/api/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setPatients)
      .catch(console.error);
  }, []);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg mb-2">Patients</h3>
      <ul>
        {patients.map(p => (
          <li key={p._id} className="border-b py-2">
            {p.firstName} {p.lastName} — <small>{p.contactNumber}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
