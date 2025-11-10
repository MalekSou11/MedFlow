export const API_URL = 'http://localhost:5000';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('mf_token'); 
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('mf_token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  let data;
  try {
    // Essaie de parser le JSON
    data = await res.clone().json(); // clone() permet de relire le corps sans erreur
  } catch (e) {
    // Si JSON invalide, retourne le texte brut
    data = await res.text();
  }

  if (!res.ok) {
    const errMessage = data?.message || data || `Erreur API: ${res.status}`;
    throw new Error(errMessage);
  }

  return data;
};
