import type { DevelopmentParams } from '@/types';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function DevelopmentParamsPanel({ params }: { params: DevelopmentParams }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <SectionHeading
        icon="🏗️"
        title="Development Parameters"
        subtitle="URA Development Control Guidelines"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <StatCard label="Max Storeys" value={`${params.maxStoreys}`} />
        <StatCard label="Max Height" value={`${params.maxHeightMetres}m`} />
        <StatCard label="Site Coverage" value={`${params.siteCoveragePct}%`} />
        <StatCard
          label="Max GFA"
          value={params.maxGfaSqm ? `${params.maxGfaSqm.toLocaleString()} sqm` : 'Subject to guidelines'}
          subLabel={params.maxGfaFormula}
        />
        <StatCard label="Front Setback" value={`${params.frontSetbackMetres}m`} />
        <StatCard
          label="Side / Rear Setback"
          value={`${params.sideSetbackMetres}m / ${params.rearSetbackMetres}m`}
        />
      </div>

      {params.notes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wide">⚠️ Important Notes</p>
          <ul className="space-y-1">
            {params.notes.map((note, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
