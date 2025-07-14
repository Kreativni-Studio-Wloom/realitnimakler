'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'Admin2025') {
      // Uložíme informaci o přihlášení do sessionStorage
      sessionStorage.setItem('adminLoggedIn', 'true');
      router.push('/login/dashboard');
    } else {
      setError('Nesprávné přihlašovací údaje');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral-900">
            Admin přihlášení
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            FN Reality - Správa nemovitostí
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Uživatelské jméno
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-t-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="Uživatelské jméno"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-b-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="Heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-semibold rounded-md px-4 py-2 text-sm shadow-sm transition-colors"
            >
              Přihlásit se
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-black hover:bg-neutral-800 text-white font-semibold rounded-md px-4 py-2 text-sm shadow-sm transition-colors"
          >
            Zpět na úvodní stránku
          </button>
        </div>
      </div>
    </div>
  );
} 