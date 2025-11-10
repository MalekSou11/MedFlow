'use client';
import PatientsList from '../../components/PatientsList';
import PatientForm from '../../components/PatientForm';
import { useState } from 'react';

export default function PatientsPage() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>
        <PatientsList key={refreshKey} onEdit={setEditing} onDeleted={triggerRefresh} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">{editing ? 'Modifier patient' : 'Créer patient'}</h2>
        <PatientForm patient={editing} onSaved={() => { setEditing(null); triggerRefresh(); }} />
      </div>
    </div>
  );
}
