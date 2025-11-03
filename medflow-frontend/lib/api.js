// lib/api.js

export const API_URL = 'http://localhost:5000'; // ✅ correction : pas de /api ici

export const getAuthHeaders = () => {
  const token = localStorage.getItem('mf_token'); // ✅ même clé que dans le login
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status}`);
  }
  return res.json();
};
