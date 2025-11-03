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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded w-80">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Créer un compte</h1>

        <input
          name="firstName"
          placeholder="Prénom"
          onChange={handleChange}
          className="border w-full mb-3 px-3 py-2 rounded"
          required
        />
        <input
          name="lastName"
          placeholder="Nom"
          onChange={handleChange}
          className="border w-full mb-3 px-3 py-2 rounded"
          required
        />
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

        <select
          name="role"
          onChange={handleChange}
          className="border w-full mb-3 px-3 py-2 rounded"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Docteur</option>
        </select>

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          S’inscrire
        </button>

        {message && <p className="text-center text-gray-600 mt-3">{message}</p>}
      </form>
    </main>
  );
}
