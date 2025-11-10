'use client';
import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function ServiceForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === '') {
      alert('Remplis le nom et le prix');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/api/services', {
        method: 'POST',
        body: JSON.stringify({ name: form.name.trim(), price: Number(form.price) }),
        headers: { 'Content-Type': 'application/json' },
      });
      setForm({ name: '', price: '' });
      onCreated?.();
    } catch (err) {
      console.error('Erreur création service:', err);
      alert(err.message || 'Impossible de créer le service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100 hover:shadow-lg transition duration-300 max-w-md"
    >
      <h2 className="text-xl font-semibold text-gray-900">Ajouter un service</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom du service (ex: Consultation)"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Prix (DTN)"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:bg-gray-900 transition"
        >
          {loading ? 'Création...' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={() => setForm({ name: '', price: '' })}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-200 transition"
        >
          Réinitialiser
        </button>
      </div>
    </form>
  );
}
