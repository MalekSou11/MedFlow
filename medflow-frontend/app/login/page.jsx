'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        localStorage.setItem('mf_token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de serveur');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded w-80">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Connexion</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border w-full mb-3 px-3 py-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          className="border w-full mb-3 px-3 py-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Se connecter
        </button>
        {error && <p className="text-center text-red-500 mt-3">{error}</p>}
      </form>
    </main>
  );
}
