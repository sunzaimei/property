import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyCard } from '@/lib/api';
import { IntelligenceCard } from '@/components/card/IntelligenceCard';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ address?: string; lat?: string; lng?: string }>;
}

export default async function PropertyPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { address, lat, lng } = await searchParams;

  let data;
  try {
    data = await getPropertyCard(id, { address, lat, lng });
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-slate-950 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1.5 text-white font-black text-lg tracking-tight hover:text-amber-400 transition-colors">
          <span>🏡</span> LandedIQ
        </Link>
        <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors ml-auto">
          ← New Search
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <IntelligenceCard data={data} />
      </div>
    </div>
  );
}
