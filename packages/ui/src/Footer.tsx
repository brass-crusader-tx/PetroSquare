import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full bg-surface border-t border-border mt-auto py-6 px-8 text-xs text-muted font-mono z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    <Link href="/support" className="hover:text-white transition-colors">Support</Link>
                    <a href="https://paypal.me/EzraJBoisvert" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Donate</a>
                </div>
                <div className="text-right">
                    <span className="block text-slate-500">PetroSquare Platform v1.0.4</span>
                </div>
            </div>
            <div className="text-center pt-4 border-t border-border/30 text-slate-600">
                &copy; {new Date().getFullYear()} PetroSquare Inc. All rights reserved.
            </div>
        </footer>
    );
}
