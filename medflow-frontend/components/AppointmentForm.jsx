'use client';

import { useEffect, useState } from 'react';
import { API_URL, getAuthHeaders } from '../lib/api';

export default function AppointmentForm({ onSaved }) {
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    patient: '',
    doctor: '', // optionnel si assigné côté backend
    service: '',
    start: '',
    end: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch(`${API_URL}/api/patients`, { headers: getAuthHeaders() }),
          fetch(`${API_URL}/api/services`, { headers: getAuthHeaders() })
        ]);
        if (pRes.ok) setPatients(await pRes.json());
        if (sRes.ok) setServices(await sRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      // format attendu par le backend : patient (id), start (ISO), end (ISO), service
      const res = await fetch(`http://localhost:5000/api/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          patient: form.patient,
          service: form.service,
          start: form.start,
          end: form.end
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur création rdv');
      setForm({ patient: '', doctor: '', service: '', start: '', end: '' });
      onSaved?.(data);
      alert('Rendez-vous créé');
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">Créer un rendez-vous</h3>

      <select name="patient" value={form.patient} onChange={handleChange} required className="w-full p-2 border">
        <option value="">Sélectionner patient</option>
        {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
      </select>

      <select name="service" value={form.service} onChange={handleChange} className="w-full p-2 border">
        <option value="">Sélectionner service</option>
        {services.map(s => <option key={s._id} value={s.name}>{s.name} — {s.price}DTN</option>)}
      </select>

      <label className="block">
        <span>Début</span>
        <input name="start" type="datetime-local" value={form.start} onChange={handleChange} className="w-full p-2 border" required />
      </label>

      <label className="block">
        <span>Fin (optionnel)</span>
        <input name="end" type="datetime-local" value={form.end} onChange={handleChange} className="w-full p-2 border" />
      </label>

      <button className="bg-green-600 text-white px-4 py-2 rounded">Créer</button>
    </form>
  );
}
