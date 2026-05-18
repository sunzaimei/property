import type { URAZone } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ZonePanel({ zone }: { zone: URAZone }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <SectionHeading icon="🗺️" title="URA Zone & Land Use" subtitle={`Master Plan ${zone.masterPlanYear}`} />

      {zone.isGcba && (
        <div className="mb-4 rounded-xl bg-amber-500 px-4 py-3 flex items-center gap-2">
          <span className="text-white text-lg">⭐</span>
          <div>
            <p className="text-white font-bold text-sm uppercase tracking-wide">Good Class Bungalow Area</p>
            <p className="text-amber-100 text-xs mt-0.5">{zone.gcbaName}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {zone.zoneLabel}
        </span>
        {!zone.isGcba && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs font-medium">
            ✓ Not in GCB Area
          </span>
        )}
      </div>

      {zone.isGcba && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>GCB Area restrictions:</strong> Minimum plot size 1,400 sqm · Maximum 2 storeys ·
          Site coverage capped at 40% · <strong>Singapore Citizens only</strong>
        </div>
      )}
    </div>
  );
}
