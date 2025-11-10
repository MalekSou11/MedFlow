'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToken } from '../../lib/auth';
import { emitLogin } from '../../lib/authEvents';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);
        emitLogin();
        router.push('/dashboard');
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de serveur');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white shadow-lg p-8 rounded-2xl w-80"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Connexion</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Bouton gris clair */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 w-full py-2 rounded font-medium transition">
          Se connecter
        </button>

        {error && (
          <p className="text-center text-red-400 mt-3 font-medium">{error}</p>
        )}
      </form>
    </main>
  );
}
