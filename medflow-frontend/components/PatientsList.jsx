'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function PatientsList({ onEdit, onDeleted }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPrescriptions, setNewPrescriptions] = useState({}); // stocke le texte pour chaque patient

  // 🔹 Récupérer les patients et leurs prescriptions
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

  // 🔹 Supprimer un patient
  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce patient ?')) return;
    await apiFetch(`/api/patients/${id}`, { method: 'DELETE' });
    onDeleted?.();
    fetchPatients();
  };

  // 🔹 Télécharger PDF ordonnance
  const handleDownload = (prescriptionId) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/prescriptions/${prescriptionId}/pdf`, '_blank');
  };

  // 🔹 Ajouter une ordonnance
  const handleAddPrescription = async (patientId) => {
    const medicines = newPrescriptions[patientId]?.split(',')
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

  if (loading) return <p>Chargement des patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!patients.length) return <p>Aucun patient trouvé</p>;

  return (
    <div className="space-y-4">
      {patients.map((p) => (
        <div key={p._id} className="border p-4 rounded bg-white shadow">
          <div className="flex justify-between">
            <div>
              <div><strong>{p.firstName} {p.lastName}</strong></div>
              <div>Email: {p.email}</div>
              <div>Téléphone: {p.contactNumber || '-'}</div>
              <div>Créé le: {new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onEdit?.(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>

          {/* 🔹 Section Ordonnances */}
          <div className="mt-2">
            <strong>Ordonnances :</strong>
            {p.prescriptions?.length > 0 ? (
              <ul className="list-disc ml-6">
                {p.prescriptions.map((pres) => (
                  <li key={pres._id}>
                    {new Date(pres.date).toLocaleDateString()}
                    <button
                      onClick={() => handleDownload(pres._id)}
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Télécharger PDF
                    </button>
                  </li>
                ))}
              </ul>
            ) : <span> Aucune ordonnance</span>}

            {/* 🔹 Formulaire ajout ordonnance */}
            <div className="mt-2 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Médicaments séparés par des virgules"
                value={newPrescriptions[p._id] || ''}
                onChange={(e) => setNewPrescriptions({ ...newPrescriptions, [p._id]: e.target.value })}
                className="border px-2 py-1 rounded flex-1"
              />
              <button
                onClick={() => handleAddPrescription(p._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
