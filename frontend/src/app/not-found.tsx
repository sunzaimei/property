import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
      <span className="text-6xl mb-4">🏚️</span>
      <h1 className="text-3xl font-bold text-white mb-2">Property Not Found</h1>
      <p className="text-slate-400 mb-6">This property ID doesn&apos;t exist in our database.</p>
      <Link
        href="/"
        className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Back to Search
      </Link>
    </div>
  );
}
