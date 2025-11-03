'use client';
import { useState } from 'react';
import { API_URL } from '../lib/api';
import { getToken } from '../lib/auth';

export default function PatientForm({ onSaved }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', contactNumber:''});
  const token = getToken();

  const save = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) { onSaved?.(data); setForm({ firstName:'', lastName:'', email:'', contactNumber:'' }); }
    else alert(data.message || 'Erreur');
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded shadow">
      <h4 className="mb-2">Nouveau patient</h4>
      <input className="w-full p-2 mb-2" placeholder="Prénom" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} />
      <input className="w-full p-2 mb-2" placeholder="Nom" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
      <input className="w-full p-2 mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="w-full p-2 mb-2" placeholder="Téléphone" value={form.contactNumber} onChange={e=>setForm({...form, contactNumber:e.target.value})} />
      <button className="w-full bg-green-600 text-white p-2 rounded">Créer</button>
    </form>
  );
}
