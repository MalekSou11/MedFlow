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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2">
        <AppointmentsCalendar
          key={key}
          onEventClick={(evt) => {
            alert(`RDV: ${evt._id || evt.id}`);
          }}
        />
      </div>
      <div>
        <AppointmentForm onSaved={onSaved} />
      </div>
    </div>
  );
}
