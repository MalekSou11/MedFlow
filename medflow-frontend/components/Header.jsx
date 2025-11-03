'use client';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <div className="text-lg font-bold">MedFlow</div>
      <div>
        {user ? (
          <>
            <span className="mr-4">Bonjour, {user.firstName || user.email}</span>
            <button className="btn" onClick={() => { logout(); router.push('/login'); }}>Se déconnecter</button>
          </>
        ) : (
          <button className="btn" onClick={() => router.push('/login')}>Se connecter</button>
        )}
      </div>
    </header>
  );
}
