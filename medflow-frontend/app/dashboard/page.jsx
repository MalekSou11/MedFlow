'use client';
import Link from 'next/link';
import { User, Calendar, FileText, CreditCard, Settings } from 'react-feather'; // Icônes pro

export default function DashboardPage() {
  const cards = [
    {
      title: 'Gestion Patients',
      desc: 'CRUD patients, profil, historique médical.',
      href: '/patients',
      icon: <User size={28} className="text-gray-700" />,
    },
    {
      title: 'Agenda & Rendez-vous',
      desc: 'Calendrier, création et modification de RDV.',
      href: '/appointments',
      icon: <Calendar size={28} className="text-gray-700" />,
    },
    {
      title: 'Consultations & Ordonnances',
      desc: 'Saisir diagnostics, générer ordonnances PDF.',
      href: '/consultations',
      icon: <FileText size={28} className="text-gray-700" />,
    },
    {
      title: 'Facturation',
      desc: 'Factures, paiements (Stripe en mode test).',
      href: '/invoices',
      icon: <CreditCard size={28} className="text-gray-700" />,
    },
    {
      title: 'Administration',
      desc: 'Services, tarifs, staff, paramètres cliniques.',
      href: '/admin',
      icon: <Settings size={28} className="text-gray-700" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-xl text-gray-900 border-b border-gray-200">
          Dashboard Médical
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-200 text-gray-800 font-medium"
            >
              <span className="mr-3">{card.icon}</span>
              {card.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
          <div className="text-gray-600">Bienvenue, Docteur</div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition duration-300">
                  {card.icon}
                </div>
                <h2 className="ml-4 text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition">
                  {card.title}
                </h2>
              </div>
              <p className="text-gray-600">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
