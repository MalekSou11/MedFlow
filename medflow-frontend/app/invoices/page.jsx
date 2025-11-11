'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function InvoicesPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ description: '', qty: 1, amount: 0 });
  const [items, setItems] = useState([]);

  // Charger patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiFetch('/api/patients');
        setPatients(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  // Charger factures
  const fetchInvoices = async (patientId) => {
    if (!patientId) return;
    setLoadingInvoices(true);
    try {
      const data = await apiFetch('/api/invoices');
      const filtered = data.filter(inv => inv.patient && inv.patient._id === patientId);
      setInvoices(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) fetchInvoices(selectedPatient._id);
    else setInvoices([]);
  }, [selectedPatient]);

  // Ajouter un article
  const addItem = () => {
    if (!newItem.description || newItem.amount <= 0) return alert('Remplir tous les champs');
    setItems([...items, newItem]);
    setNewItem({ description: '', qty: 1, amount: 0 });
  };

  // Créer une facture
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert('Choisir un patient');
    if (items.length === 0) return alert('Ajouter au moins un article');

    const total = items.reduce((sum, item) => sum + item.qty * item.amount, 0);
    const body = {
      patient: selectedPatient._id,
      items,
      total,
      status: 'unpaid',
    };

    try {
      await apiFetch('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      alert('Facture créée avec succès');
      setItems([]);
      fetchInvoices(selectedPatient._id);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la facture');
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (loadingPatients) return <p>Chargement des patients...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-gray-800">Facturation & Paiement</h1>

      {/* Choix du patient */}
      <div>
        <label className="block text-gray-700 mb-2">Choisir un patient :</label>
        <select
          className="border rounded-lg p-2 w-full bg-white focus:outline-none"
          value={selectedPatient?._id || ''}
          onChange={e => setSelectedPatient(patients.find(p => p._id === e.target.value))}
        >
          <option value="">-- Sélectionner un patient --</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Formulaire de création */}
      {selectedPatient && (
        <div className="border rounded-xl p-5 bg-white space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Créer une facture</h2>

          <form onSubmit={handleCreateInvoice} className="space-y-4">
            {/* Ajouter un article */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Description"
                className="border p-2 rounded flex-1"
                value={newItem.description}
                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              />
              <input
                type="number"
                min="1"
                placeholder="Qté"
                className="border p-2 rounded w-20"
                value={newItem.qty}
                onChange={e => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
              />
              <input
                type="number"
                min="0"
                placeholder="Prix"
                className="border p-2 rounded w-32"
                value={newItem.amount}
                onChange={e => setNewItem({ ...newItem, amount: parseFloat(e.target.value) })}
              />
              <button
                type="button"
                onClick={addItem}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                Ajouter
              </button>
            </div>

            {/* Liste des articles ajoutés */}
            {items.length > 0 && (
              <div className="border-t pt-3">
                <ul className="space-y-1 text-gray-700">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.description} — {it.qty} × {it.amount} €
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Enregistrer la facture
            </button>
          </form>
        </div>
      )}

      {/* Liste des factures existantes */}
      {selectedPatient && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Factures du patient</h2>
          {loadingInvoices ? (
            <p>Chargement des factures...</p>
          ) : invoices.length === 0 ? (
            <p className="text-gray-500 italic">Aucune facture pour ce patient</p>
          ) : (
            invoices.map(inv => (
              <div
                key={inv._id}
                className="border rounded-xl p-4 bg-white space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Facture #{inv._id}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
                        inv.status === 'paid'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inv.status === 'paid' ? 'Payé' : 'Non payé'}
                    </span>
                  </div>

                  {inv.status !== 'paid' && (
                    <button
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                      onClick={async () => {
                        try {
                          await apiFetch(`/api/invoices/${inv._id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ status: 'paid' }),
                          });
                          fetchInvoices(selectedPatient._id);
                        } catch (err) {
                          console.error(err);
                          alert('Erreur lors du paiement');
                        }
                      }}
                    >
                      Marquer comme payé
                    </button>
                  )}
                </div>

                <div className="text-gray-700">
                  <strong>Montant total :</strong>{' '}
                  {inv.total ? inv.total.toFixed(2) : '0.00'} €
                </div>

                <div>
                  <strong>Articles :</strong>
                  <ul className="ml-4 mt-1 list-disc text-gray-600">
                    {inv.items && inv.items.length > 0 ? (
                      inv.items.map((item, idx) => (
                        <li key={idx}>
                          {item.description} — {item.qty} × {item.amount} €
                        </li>
                      ))
                    ) : (
                      <li>Aucun article</li>
                    )}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
