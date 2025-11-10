'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import AppointmentForm from '../../components/AppointmentForm';

// FullCalendar est un composant client lourd → import dynamique sans SSR
const AppointmentsCalendar = dynamic(
  () => import('../../components/AppointmentsCalendar'),
  { ssr: false }
);

export default function AppointmentsPage() {
  const [key, setKey] = React.useState(0);

  const onSaved = () => setKey((k) => k + 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Agenda & Rendez-vous</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calendrier des RDV</h2>
          <AppointmentsCalendar
            key={key}
            onEventClick={(evt) => {
              alert(`RDV: ${evt._id || evt.id}`);
            }}
          />
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouveau RDV</h2>
          <AppointmentForm onSaved={onSaved} />
        </div>
      </div>
    </div>
  );
}
