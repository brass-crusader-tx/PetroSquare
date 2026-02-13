"use client";

import { useState, useEffect, ReactNode } from 'react';
import { Badge } from '@petrosquare/ui';

interface PasswordGateProps {
  children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('petrosquare-auth');
    if (auth === 'PetroV0') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PetroV0') {
      localStorage.setItem('petrosquare-auth', 'PetroV0');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (loading) return null; // Or a spinner

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
             <img src="/logo/petrosquare-mark.svg" alt="PetroSquare" width="96" height="96" />
             <h1 className="text-2xl font-bold text-white tracking-tight">PetroSquare</h1>
          </div>

          <p className="text-slate-400 mb-6 text-sm">
            This is a restricted access environment. Please enter your credentials to proceed.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-500 mb-1 font-bold">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter access key..."
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs flex items-center">
                <span>Invalid access key. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
            <span>v1.0.0-rc1</span>
            <Badge status="live">System Active</Badge>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
