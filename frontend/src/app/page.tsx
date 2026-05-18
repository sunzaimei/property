import { SearchBar } from '@/components/search/SearchBar';

const EXAMPLES = [
  { id: 'prop_07', label: '27 Nassim Road (GCB)' },
  { id: 'prop_10', label: '41 Emerald Hill (Conservation)' },
  { id: 'prop_01', label: '45 Tembeling Road (Terrace)' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-3xl">🏡</span>
          <span className="text-3xl font-black text-white tracking-tight">LandedIQ</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
          Singapore landed property<br />
          <span className="text-amber-400">due diligence, in seconds</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          URA zone, development parameters, transaction history, ownership rules and risk flags —
          all in one place.
        </p>
      </div>

      <SearchBar />

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <span className="text-slate-500 text-sm self-center">Try:</span>
        {EXAMPLES.map(e => (
          <a
            key={e.id}
            href={`/property/${e.id}`}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
          >
            {e.label}
          </a>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-3 justify-center max-w-2xl">
        {[
          '🗺️ URA Zone + GCB Area',
          '🏗️ Development Parameters',
          '📊 Transaction PSF History',
          '🏛️ Ownership Eligibility',
          '⚠️ Flood & Tree Risk Flags',
          '🛣️ Road Reserve Alerts',
        ].map(f => (
          <span key={f} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-700">
            {f}
          </span>
        ))}
      </div>

      <p className="mt-12 text-slate-600 text-xs text-center max-w-md">
        MVP — seed data only. Always verify with URA, SLA, LTA, NParks and a qualified property lawyer before transacting.
      </p>
    </main>
  );
}
