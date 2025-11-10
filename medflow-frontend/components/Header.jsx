"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  // Mettre à jour le token à chaque rendu client
  useEffect(() => {
    setToken(localStorage.getItem("mf_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mf_token");
    setToken(null); // force rerender
    router.push("/login");
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={() => router.push("/")}>
        🩺 <span>MedFlow</span>
      </div>
      <nav>
        {token ? (
          <>
            <Link href="/dashboard">Accueil</Link>
            <Link href="/patients">Patients</Link>
            <Link href="/consultations">Consultations</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
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
