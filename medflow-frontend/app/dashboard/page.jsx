'use client';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/patients" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">👩‍⚕️ Gestion Patients</h2>
          <p>CRUD patients, profil, historique médical.</p>
        </Link>

        <Link href="/appointments" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">📅 Agenda & Rendez-vous</h2>
          <p>Calendrier, création et modification de RDV.</p>
        </Link>

        <Link href="/consultations" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">📝 Consultations & Ordonnances</h2>
          <p>Saisir diagnostics, générer ordonnances PDF.</p>
        </Link>

        <Link href="/invoices" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">💳 Facturation</h2>
          <p>Factures, paiements (Stripe en mode test).</p>
        </Link>

        <Link href="/admin" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">⚙️ Administration</h2>
          <p>Services, tarifs, staff, paramètres cliniques.</p>
        </Link>
      </div>
    </div>
  );
}
