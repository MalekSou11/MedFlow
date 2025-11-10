'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getToken, clearToken } from "../lib/auth";
import { emitLogout } from "../lib/authEvents";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const handleAuthChange = () => setToken(getToken());

    window.addEventListener("login", handleAuthChange);
    window.addEventListener("logout", handleAuthChange);

    return () => {
      window.removeEventListener("login", handleAuthChange);
      window.removeEventListener("logout", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    setToken(null);
    emitLogout(); // Notifie les autres composants
    router.push("/login");
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={() => router.push("/")}>🩺 <span>MedFlow</span></div>
      <nav>
        {token ? (
          <>
            <Link href="/dashboard">Accueil</Link>
            <Link href="/patients">Patients</Link>
            <Link href="/consultations">Consultations</Link>
            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link href="/login">Connexion</Link>
            <Link href="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}
