"use client";

import { useState, useEffect, type ReactNode } from 'react';

export function Gate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('petrosquare-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PetroV0') {
      localStorage.setItem('petrosquare-auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (loading) {
    return <div className="h-screen bg-background flex items-center justify-center text-muted">Initialize Security...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-white font-mono text-xl mx-auto mb-4">
              P
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">PetroSquare Platform</h2>
            <p className="mt-2 text-sm text-muted">Restricted Access. Engineering Authorization Required.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-surface border border-border p-8 rounded shadow-xl">
             <div>
               <label htmlFor="password" className="sr-only">Password</label>
               <input
                 id="password"
                 name="password"
                 type="password"
                 required
                 className="appearance-none rounded relative block w-full px-3 py-2 border border-border bg-surface-inset text-white placeholder-muted focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                 placeholder="Access Code"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
             </div>

             {error && (
               <div className="text-xs text-error text-center font-mono bg-error/10 py-2 rounded">
                 ACCESS DENIED: Invalid Credentials
               </div>
             )}

             <button
               type="submit"
               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
             >
               Verify Identity
             </button>
          </form>

          <div className="text-center text-xs text-muted font-mono opacity-50">
            System ID: {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 20) : 'UNK'}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
