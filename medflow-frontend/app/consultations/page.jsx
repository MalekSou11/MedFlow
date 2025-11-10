'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function ConsultationsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  const handleAddConsultation = async () => {
    if (!selectedPatient) return alert('Choisissez un patient');
    if (!diagnosis.trim()) return alert('Entrez un diagnostic');

    try {
      if (medicines.trim()) {
        const medArray = medicines
          .split(',')
          .map(m => m.trim())
          .filter(m => m)
          .map(name => ({ name, dose: '', frequency: '', duration: '' }));

        await apiFetch('/api/prescriptions', {
          method: 'POST',
          body: JSON.stringify({ patient: selectedPatient._id, medicines: medArray, notes }),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      alert('Consultation ajoutée !');
      setDiagnosis('');
      setNotes('');
      setMedicines('');
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'ajout de la consultation');
    }
  };

  const handleDownloadPrescription = (presId) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/prescriptions/${presId}/pdf`, '_blank');
  };

  if (loading) return <p className="text-gray-600">Chargement des patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Consultations & Ordonnances</h1>

      {/* Choix patient */}
      <select
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
        value={selectedPatient?._id || ''}
        onChange={e => setSelectedPatient(patients.find(p => p._id === e.target.value))}
      >
        <option value="">-- Choisir un patient --</option>
        {patients.map(p => (
          <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
        ))}
      </select>

      {/* Formulaire consultation */}
      {selectedPatient && (
        <div className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Diagnostic</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ordonnance (médicaments séparés par des virgules)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={medicines}
              onChange={e => setMedicines(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddConsultation}
            className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition disabled:opacity-50"
          >
            Ajouter consultation
          </button>
        </div>
      )}

      {/* Liste des ordonnances */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Ordonnances existantes</h2>
        {patients.map(p => (
          <div key={p._id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="font-medium text-gray-900 mb-2">{p.firstName} {p.lastName}</div>
            {p.prescriptions?.length > 0 ? (
              <ul className="ml-4 list-disc space-y-1">
                {p.prescriptions.map(pres => (
                  <li key={pres._id} className="flex items-center justify-between">
                    <span>{new Date(pres.date).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDownloadPrescription(pres._id)}
                      className="text-gray-700 hover:text-gray-900 underline text-sm"
                    >
                      Télécharger PDF
                    </button>
                  </li>
                ))}
              </ul>
            ) : <div className="text-gray-500 italic">Aucune ordonnance</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
