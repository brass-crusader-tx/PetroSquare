"use client";

import { useState, useEffect, type ReactNode } from 'react';

export function AccessGate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('petro_auth');
    if (auth === 'PetroV0') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PetroV0') {
      localStorage.setItem('petro_auth', 'PetroV0');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (checking) {
    return <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded border border-slate-700 shadow-2xl">
          <div className="flex justify-center mb-6">
             <img src="/logo/petrosquare-mark.svg" alt="PetroSquare" className="w-12 h-12" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-2">PetroSquare Platform</h1>
          <p className="text-slate-400 text-center text-sm mb-6">Authorized Access Only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter Access Key"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2">Invalid access key.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
            >
              Enter Platform
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 font-mono">
            SECURE ENVIRONMENT • VER 1.0.4
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
