'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function PatientsList({ onEdit, onDeleted }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPrescriptions, setNewPrescriptions] = useState({});

  const fetchPatients = async () => {
    try {
      const data = await apiFetch('/api/patients');
      const patientsWithPrescriptions = await Promise.all(
        data.map(async (p) => {
          const prescriptions = await apiFetch(`/api/prescriptions?patientId=${p._id}`);
          return { ...p, prescriptions };
        })
      );
      setPatients(patientsWithPrescriptions);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce patient ?')) return;
    await apiFetch(`/api/patients/${id}`, { method: 'DELETE' });
    onDeleted?.();
    fetchPatients();
  };

  const handleDownload = (prescriptionId) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/prescriptions/${prescriptionId}/pdf`,
      '_blank'
    );
  };

  const handleAddPrescription = async (patientId) => {
    const medicines = newPrescriptions[patientId]
      ?.split(',')
      .map(m => m.trim())
      .filter(m => m)
      .map(name => ({ name, dose: '', frequency: '', duration: '' })) || [];

    if (!medicines.length) return alert('Entrez au moins un médicament séparé par des virgules');

    try {
      await apiFetch('/api/prescriptions', {
        method: 'POST',
        body: JSON.stringify({ patient: patientId, medicines }),
      });
      setNewPrescriptions({ ...newPrescriptions, [patientId]: '' });
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la prescription');
    }
  };

  if (loading) return <p className="text-gray-600">Chargement des patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!patients.length) return <p className="text-gray-600">Aucun patient trouvé</p>;

  return (
    <div className="space-y-8">
      {patients.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300"
        >
          {/* Infos patient */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">{p.firstName} {p.lastName}</h2>
              <p className="text-gray-700">Email: {p.email}</p>
              <p className="text-gray-700">Téléphone: {p.contactNumber || '-'}</p>
              <p className="text-gray-500 text-sm">Créé le: {new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => onEdit?.(p)}
                className="bg-gray-200 text-gray-900 px-5 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-gray-200 text-gray-900 px-5 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Supprimer
              </button>
            </div>
          </div>

          {/* Ordonnances */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ordonnances</h3>
            {p.prescriptions?.length > 0 ? (
              <ul className="space-y-1 ml-5">
                {p.prescriptions.map((pres) => (
                  <li key={pres._id} className="flex justify-between text-gray-700">
                    <span>{new Date(pres.date).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDownload(pres._id)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Télécharger PDF
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 ml-5">Aucune ordonnance</p>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Médicaments séparés par des virgules"
                value={newPrescriptions[p._id] || ''}
                onChange={(e) => setNewPrescriptions({ ...newPrescriptions, [p._id]: e.target.value })}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
              <button
                onClick={() => handleAddPrescription(p._id)}
                className="bg-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition"
              >
                Ajouter ordonnance
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
