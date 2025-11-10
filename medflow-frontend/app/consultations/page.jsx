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

  // 🔹 Charger tous les patients avec leurs prescriptions
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

  // 🔹 Ajouter une consultation + ordonnance
  const handleAddConsultation = async () => {
    if (!selectedPatient) return alert('Choisissez un patient');
    if (!diagnosis.trim()) return alert('Entrez un diagnostic');

    try {
      let prescription = null;

      if (medicines.trim()) {
        const medArray = medicines
          .split(',')
          .map(m => m.trim())
          .filter(m => m)
          .map(name => ({ name, dose: '', frequency: '', duration: '' }));

        prescription = await apiFetch('/api/prescriptions', {
          method: 'POST',
          body: JSON.stringify({
            patient: selectedPatient._id,
            medicines: medArray,
            notes,
          }),
        });
      }

      // Ici tu peux stocker la consultation si tu as une table Consultation, sinon tu stockes juste la prescription
      // Exemple minimal : on ne fait rien d'autre pour l'instant

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

  if (loading) return <p>Chargement des patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Consultations & Ordonnances</h1>

      {/* Choisir patient */}
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

      {/* Formulaire consultation */}
      {selectedPatient && (
        <div className="border p-4 rounded bg-white shadow space-y-3">
          <div>
            <label className="font-semibold">Diagnostic:</label>
            <textarea
              className="border w-full p-2 rounded"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">Notes:</label>
            <textarea
              className="border w-full p-2 rounded"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">Ordonnance (médicaments séparés par des virgules):</label>
            <input
              className="border w-full p-2 rounded"
              value={medicines}
              onChange={e => setMedicines(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddConsultation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter consultation
          </button>
        </div>
      )}

      {/* Liste des ordonnances */}
      <div>
        <h2 className="text-xl font-semibold">Ordonnances existantes</h2>
        {patients.map(p => (
          <div key={p._id} className="border p-2 rounded mb-2">
            <div><strong>{p.firstName} {p.lastName}</strong></div>
            {p.prescriptions?.length > 0 ? (
              <ul className="ml-4 list-disc">
                {p.prescriptions.map(pres => (
                  <li key={pres._id}>
                    {new Date(pres.date).toLocaleDateString()}
                    <button
                      onClick={() => handleDownloadPrescription(pres._id)}
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Télécharger PDF
                    </button>
                  </li>
                ))}
              </ul>
            ) : <div>Aucune ordonnance</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
