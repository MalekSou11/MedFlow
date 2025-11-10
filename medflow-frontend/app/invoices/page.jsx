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

  const fetchInvoices = async (patientId) => {
    if (!patientId) return;
    setLoadingInvoices(true);
    try {
      const data = await apiFetch('/api/invoices');
      const filtered = data.filter(inv => inv.patient._id === patientId);
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

  if (error) return <p className="text-red-600">{error}</p>;
  if (loadingPatients) return <p>Chargement des patients...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800">Facturation & Paiement</h1>

      {/* Sélecteur de patient */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Choisir un patient :</label>
        <select
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedPatient?._id || ''}
          onChange={e => setSelectedPatient(patients.find(p => p._id === e.target.value))}
        >
          <option value="">-- Choisir un patient --</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      {selectedPatient && (
        <div className="space-y-4">
          {loadingInvoices ? (
            <p className="text-gray-600">Chargement des factures...</p>
          ) : (
            invoices.length === 0 ? (
              <p className="text-gray-500 italic">Aucune facture pour ce patient</p>
            ) : (
              invoices.map(inv => (
                <div key={inv._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Facture #{inv._id}</h2>
                      <span
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {inv.status === 'paid' ? 'Payé' : 'Non payé'}
                      </span>
                    </div>
                    {inv.status !== 'paid' && (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                        Payer
                      </button>
                    )}
                  </div>

                  <div className="text-gray-700 mb-2">
                    <strong>Montant total :</strong> ${inv.total.toFixed(2)}
                  </div>

                  <div>
                    <strong className="text-gray-700">Articles :</strong>
                    <ul className="ml-4 mt-1 list-disc space-y-1 text-gray-600">
                      {inv.items.map((item, idx) => (
                        <li key={idx}>{item.description} - {item.qty} x ${item.amount}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
