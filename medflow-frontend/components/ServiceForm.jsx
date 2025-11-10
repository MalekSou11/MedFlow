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
      // Utilise apiFetch centralisé ; apiFetch attend le endpoint commençant par /api/...
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
    <form onSubmit={handleCreate} className="space-y-3">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom du service (ex: Consultation)"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        required
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Prix (DTN)"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? 'Création...' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={() => setForm({ name: '', price: '' })}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Réinitialiser
        </button>
      </div>
    </form>
  );
}
