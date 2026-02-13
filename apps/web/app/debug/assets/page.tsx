export const dynamic = 'force-dynamic';

export default function AssetDebugPage() {
  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Asset Debugger</h1>

      <div className="space-y-8">
        <div className="border border-slate-700 p-4 rounded">
          <h2 className="text-xl mb-2">SVG Logo (/logo/petrosquare-mark.svg)</h2>
          <img
            src="/logo/petrosquare-mark.svg"
            alt="SVG Logo"
            width="100"
            height="100"
            className="bg-slate-800 border border-slate-600"
          />
        </div>

        <div className="border border-slate-700 p-4 rounded">
          <h2 className="text-xl mb-2">Favicon 32x32 (/favicon-32x32.png)</h2>
          <img
            src="/favicon-32x32.png"
            alt="Favicon 32"
            width="32"
            height="32"
            className="bg-slate-800 border border-slate-600"
          />
        </div>

        <div className="border border-slate-700 p-4 rounded">
          <h2 className="text-xl mb-2">Logo 192x192 (/logo-192x192.png)</h2>
          <img
            src="/logo-192x192.png"
            alt="Logo 192"
            width="192"
            height="192"
            className="bg-slate-800 border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
