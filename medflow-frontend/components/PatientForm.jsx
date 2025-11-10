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
  body: JSON.stringify(form), // <-- ici aussi
});

      } else {
    
        await apiFetch('/api/patients', {
  method: 'POST',
  body: JSON.stringify(form), // <-- ici
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
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-3">
      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Prénom" className="w-full border px-3 py-2 rounded" required />
      <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nom" className="w-full border px-3 py-2 rounded" required />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border px-3 py-2 rounded" required />
      <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Téléphone" className="w-full border px-3 py-2 rounded" />
      <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">
        {saving ? 'Enregistrement...' : (patient ? 'Mettre à jour' : 'Créer')}
      </button>
    </form>
  );
}
