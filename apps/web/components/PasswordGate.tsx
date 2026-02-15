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
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
        <div className="max-w-md w-full bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
             <img src="/logo/petrosquare-mark.svg" alt="PetroSquare" width="64" height="64" className="mb-4" />
             <h1 className="text-2xl font-bold text-white tracking-tight">PetroSquare</h1>
          </div>

          <p className="text-muted mb-8 text-sm text-center leading-relaxed">
            This is a restricted access environment. Please enter your credentials to proceed.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-muted/70 mb-2 font-bold tracking-wider">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-highlight/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted/30"
                placeholder="Enter access key..."
                autoFocus
              />
            </div>

            {error && (
              <div className="text-data-critical text-xs flex items-center justify-center font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                <span>Invalid access key. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-background font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-muted/50">
            <span className="font-mono">v1.0.0-rc1</span>
            <Badge status="live">System Active</Badge>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
