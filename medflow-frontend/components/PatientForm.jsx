'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function PatientForm({ patient = null, onSaved }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', contactNumber: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        contactNumber: patient.contactNumber || ''
      });
    }
  }, [patient]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (patient?._id) {
        await apiFetch(`/api/patients/${patient._id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch('/api/patients', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      onSaved?.();
    } catch (err) {
      console.error('Erreur save patient', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100 hover:shadow-lg transition duration-300">
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="Prénom"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Nom"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />
      <input
        name="contactNumber"
        value={form.contactNumber}
        onChange={handleChange}
        placeholder="Téléphone"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-900 transition"
      >
        {saving ? 'Enregistrement...' : (patient ? 'Mettre à jour' : 'Créer')}
      </button>
    </form>
  );
}
