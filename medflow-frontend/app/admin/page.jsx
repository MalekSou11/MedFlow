'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function AdminPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [loading, setLoading] = useState(false);

  // Charger les services existants
  const load = async () => {
    try {
      const data = await apiFetch('/api/services', { method: 'GET' });
      setServices(data || []);
    } catch (err) {
      console.error('Erreur de chargement des services:', err);
    }
  };

  useEffect(() => { load(); }, []);

  // Créer un nouveau service
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/services', { 
        method: 'POST', 
        body: JSON.stringify(form), // ✅ Conversion en JSON
      });
      setForm({ name: '', price: '' });
      await load();
    } catch (err) {
      console.error('Erreur lors de la création du service:', err);
      alert('Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        ⚙️ Administration — Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Liste des services */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🗂️ Liste des services
          </h2>
          {services.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {services.map((s) => (
                <li key={s._id} className="py-3 flex justify-between text-gray-700">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-indigo-600">{s.price} DTN</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">Aucun service enregistré.</p>
          )}
        </div>

        {/* Création de service */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ➕ Créer un service
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nom du service</label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Consultation"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Prix (DTN)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Ex: 50"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
