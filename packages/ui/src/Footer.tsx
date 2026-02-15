import React from 'react';
import { Coffee } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 mt-auto py-12 px-6 bg-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Support */}
            <div className="space-y-4">
                <div className="flex items-center gap-1">
                    <img src="/logo/petrosquare-mark.svg" className="w-20 h-20 invert brightness-0 grayscale opacity-90" alt="PetroSquare" />
                    <span className="text-lg font-bold text-white tracking-tight">PetroSquare</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                    The vendor-neutral digital operating system for the modern oil & gas enterprise.
                </p>
                <a
                    href="https://paypal.me/EzraJBoisvert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#003087]/20 hover:bg-[#003087]/30 text-[#003087] dark:text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
                >
                    <Coffee size={14} />
                    <span>Buy me a coffee</span>
                </a>
            </div>

            {/* Column 2: Modules */}
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-70">Modules</h4>
                <ul className="space-y-2.5 text-sm text-muted">
                    <li><a href="/" className="hover:text-primary transition-colors">Control Center</a></li>
                    <li><a href="/modules/production" className="hover:text-primary transition-colors">Production & Reserves</a></li>
                    <li><a href="/modules/markets" className="hover:text-primary transition-colors">Market Analytics</a></li>
                    <li><a href="/modules/economics" className="hover:text-primary transition-colors">Economics & Cost</a></li>
                    <li><a href="/modules/gis" className="hover:text-primary transition-colors">GIS & Asset Intelligence</a></li>
                    <li><a href="/modules/risk" className="hover:text-primary transition-colors">Risk & Regulatory</a></li>
                    <li><a href="/modules/intel" className="hover:text-primary transition-colors">Market Intelligence</a></li>
                </ul>
            </div>

            {/* Column 3: Platform */}
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-70">Platform</h4>
                <ul className="space-y-2.5 text-sm text-muted">
                    <li><a href="/capabilities" className="hover:text-primary transition-colors">Capabilities</a></li>
                    <li><a href="/architecture" className="hover:text-primary transition-colors">Architecture</a></li>
                    <li><a href="/contracts" className="hover:text-primary transition-colors">Contracts API</a></li>
                </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-70">Legal</h4>
                <ul className="space-y-2.5 text-sm text-muted">
                    <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Use</a></li>
                    <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                </ul>
            </div>

            {/* Copyright Row */}
            <div className="col-span-full border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs text-muted/40 font-mono">
                    &copy; {currentYear} PetroSquare Inc. All rights reserved.
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    <span className="text-xs text-muted/40 font-mono">v1.0.0-rc1</span>
                </div>
            </div>
        </div>
    </footer>
  );
}
