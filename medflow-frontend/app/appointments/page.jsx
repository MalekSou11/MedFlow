'use client';
import { useState } from 'react';
import AppointmentsCalendar from '../../components/AppointmentsCalendar';
import AppointmentForm from '../../components/AppointmentForm';

export default function AppointmentsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleSaved = () => {
    setSelectedEvent(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">📅 Rendez-vous</h1>
        <AppointmentsCalendar key={refreshKey} onSelectEvent={handleSelect} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">
          {selectedEvent ? 'Modifier le rendez-vous' : 'Créer un rendez-vous'}
        </h2>
        <AppointmentForm appointment={selectedEvent} onSaved={handleSaved} />
      </div>
    </div>
  );
}
