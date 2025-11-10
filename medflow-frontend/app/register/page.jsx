'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) setMessage('✅ Inscription réussie !');
      else setMessage(data.message || '❌ Erreur lors de l’inscription');
    } catch (error) {
      console.error(error);
      setMessage('❌ Erreur de connexion au serveur');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white shadow-lg p-8 rounded-2xl w-80"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Créer un compte
        </h1>

        <input
          name="firstName"
          placeholder="Prénom"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="lastName"
          placeholder="Nom"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <select
          name="role"
          onChange={handleChange}
          className="border border-gray-600 bg-gray-700 text-white w-full mb-4 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="patient" className="text-black">Patient</option>
          <option value="doctor" className="text-black">Docteur</option>
        </select>

        <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 w-full py-2 rounded font-medium transition">
          S’inscrire
        </button>

        {message && (
          <p className="text-center text-gray-300 mt-3 font-medium">{message}</p>
        )}
      </form>
    </main>
  );
}
