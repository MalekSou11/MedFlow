export const API_URL = 'http://localhost:5000';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('mf_token'); 
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};


/* export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Erreur API: ${res.status}`);
  }
  return res.json();
}; */

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
  return res.json();
};

