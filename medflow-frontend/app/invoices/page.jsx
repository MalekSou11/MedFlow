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

  // Charger factures d’un patient
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
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Facturation & Paiement</h1>

      {/* Sélecteur de patient */}
      <select
        className="border p-2 rounded w-full"
        value={selectedPatient?._id || ''}
        onChange={e => setSelectedPatient(patients.find(p => p._id === e.target.value))}
      >
        <option value="">-- Choisir un patient --</option>
        {patients.map(p => (
          <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
        ))}
      </select>

      {selectedPatient && (
        <div className="mt-4 space-y-3">
          {loadingInvoices ? (
            <p>Chargement des factures...</p>
          ) : (
            invoices.length === 0 ? (
              <p className="text-gray-600">Aucune facture pour ce patient</p>
            ) : (
              invoices.map(inv => (
                <div key={inv._id} className="border p-4 rounded bg-white shadow space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>Facture #{inv._id}</strong> - Statut: 
                      <span className={`ml-2 font-semibold ${inv.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                        {inv.status}
                      </span>
                    </div>
                    {inv.status !== 'paid' && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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

                  <div><strong>Montant total:</strong> ${inv.total.toFixed(2)}</div>

                  <div>
                    <strong>Articles:</strong>
                    <ul className="ml-4 list-disc">
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
