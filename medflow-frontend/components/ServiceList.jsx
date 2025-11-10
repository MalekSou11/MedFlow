'use client';
import React from 'react';

export default function ServiceList({ services = [] }) {
  if (!services || services.length === 0) {
    return <p className="text-gray-500 text-sm italic">Aucun service trouvé.</p>;
  }

  return (
    <div className="divide-y">
      {services.map((s) => (
        <div
          key={s._id}
          className="flex justify-between items-center py-3 hover:bg-gray-50 transition"
        >
          <div>
            <div className="font-medium text-gray-800">{s.name}</div>
            {s.description && <div className="text-sm text-gray-500">{s.description}</div>}
          </div>
          <div className="text-indigo-600 font-semibold">{s.price} DTN</div>
        </div>
      ))}
    </div>
  );
}
