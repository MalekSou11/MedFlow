'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { saveToken, getToken, clearToken } from "../lib/auth";
import { API_URL } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getToken());

  useEffect(() => {
    if (!token) return setUser(null);
    // tu peux fetch /api/auth/me si tu as cette route
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => { clearToken(); setToken(null); setUser(null); });
  }, [token]);

  const login = (token, userData) => {
    saveToken(token);
    setToken(token);
    setUser(userData);
  };
  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
