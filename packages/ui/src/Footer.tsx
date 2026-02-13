import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs font-mono">P</div>
              <span className="font-bold text-white tracking-tight">PetroSquare</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Vendor-neutral digital operating system for the modern energy enterprise.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/modules/markets" className="hover:text-primary transition-colors">Markets & Trading</Link></li>
              <li><Link href="/modules/production" className="hover:text-primary transition-colors">Production & Reserves</Link></li>
              <li><Link href="/modules/economics" className="hover:text-primary transition-colors">Economics</Link></li>
              <li><Link href="/modules/gis" className="hover:text-primary transition-colors">GIS & Assets</Link></li>
              <li><Link href="/modules/risk" className="hover:text-primary transition-colors">Risk & Regulatory</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">System Status</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Compliance</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-muted font-mono">
            © {new Date().getFullYear()} PetroSquare Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
