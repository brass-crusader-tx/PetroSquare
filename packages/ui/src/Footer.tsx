import React from 'react';
import { Coffee } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto py-12 px-6 shrink-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Support */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <img src="/logo/petrosquare-mark.svg" width="24" height="24" alt="PetroSquare" />
                    <span className="text-lg font-bold text-white font-sans">PetroSquare</span>
                </div>
                <p className="text-sm text-muted">
                    The vendor-neutral digital operating system for the modern oil & gas enterprise.
                </p>
                <a
                    href="https://paypal.me/EzraJBoisvert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#003087] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#003087]/90 transition-colors"
                >
                    <Coffee size={16} />
                    <span>Buy me a coffee</span>
                </a>
            </div>

            {/* Column 2: Modules */}
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Modules</h4>
                <ul className="space-y-2 text-sm text-muted">
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
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted">
                    <li><a href="/capabilities" className="hover:text-primary transition-colors">Capabilities</a></li>
                    <li><a href="/architecture" className="hover:text-primary transition-colors">Architecture</a></li>
                    <li><a href="/contracts" className="hover:text-primary transition-colors">Contracts API</a></li>
                </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted">
                    <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Use</a></li>
                    <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                </ul>
                <div className="mt-6 text-xs text-muted/50">
                    &copy; {currentYear} PetroSquare.<br/>All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  );
}
