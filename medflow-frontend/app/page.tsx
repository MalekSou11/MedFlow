'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Bienvenue sur MedFlow 🏥</h1>
      <p className="text-gray-600 mb-6">Gérez vos patients et rendez-vous facilement.</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Se connecter
        </Link>
        <Link href="/register" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          S’inscrire
        </Link>
      </div>
    </main>
  );
}
