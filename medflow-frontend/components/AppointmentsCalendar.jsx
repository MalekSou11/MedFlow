'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // pour cliquer/déposer si besoin
import { API_URL, getAuthHeaders } from '../lib/api';

export default function AppointmentsCalendar({ onEventClick }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/appointments`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Erreur fetch appointments');
        const data = await res.json();
        // data est tableau d'appointments ; on mappe en events FullCalendar
        const mapped = data.map(a => ({
          id: a._id,
          title: a.patient ? `${a.patient.firstName || ''} ${a.patient.lastName || ''}`.trim() : (a.service || 'RDV'),
          start: a.start,
          end: a.end || a.start,
          extendedProps: { ...a } // garde les infos complètes si besoin
        }));
        setEvents(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        height={650}
        eventClick={(info) => {
          // info.event.extendedProps contient l'objet appointment complet
          onEventClick?.(info.event.extendedProps);
        }}
        selectable={true}
        select={(selectionInfo) => {
          // selectionInfo.startStr, endStr — tu peux ouvrir un modal/formulaire
          console.log('Selected range:', selectionInfo);
        }}
      />
    </div>
  );
}
