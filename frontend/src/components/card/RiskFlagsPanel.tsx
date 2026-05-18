import type { RiskFlags } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { RiskFlag } from '@/components/ui/RiskFlagItem';

export function RiskFlagsPanel({ flags }: { flags: RiskFlags }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <SectionHeading
        icon="⚠️"
        title="Risk Flags"
        subtitle="Flood risk, tree conservation, conservation status, road reserve"
      />

      <div className="space-y-3">
        <RiskFlag
          icon="💧"
          label="Flood Risk"
          severity={flags.floodRisk === 'high' ? 'red' : flags.floodRisk === 'medium' ? 'amber' : 'green'}
          badgeText={flags.floodRisk.charAt(0).toUpperCase() + flags.floodRisk.slice(1)}
          description={
            flags.floodRisk === 'low'
              ? `Low flood risk. Source: ${flags.floodRiskSource}`
              : flags.floodRisk === 'medium'
              ? `Medium flood risk — low-lying area. Verify drainage with PUB. Source: ${flags.floodRiskSource}`
              : `High flood risk — historical flooding recorded. Consider drainage assessment. Source: ${flags.floodRiskSource}`
          }
        />

        <RiskFlag
          icon="🌳"
          label="Tree Conservation"
          severity={flags.isTreeConservationArea ? 'amber' : 'green'}
          badgeText={flags.isTreeConservationArea ? 'Yes — NParks Approval Required' : 'None'}
          description={
            flags.isTreeConservationArea
              ? (flags.treeConservationNotes ?? 'Trees on or adjacent to this plot are protected under the Parks and Trees Act.')
              : 'No tree conservation area restrictions identified on this plot.'
          }
        />

        <RiskFlag
          icon="🏛️"
          label="Conservation Status"
          severity={flags.isConservationProperty ? 'amber' : 'green'}
          badgeText={
            flags.isConservationProperty
              ? `${flags.conservationGrade ?? 'Listed'} — ${flags.conservationAuthority ?? 'URA'}`
              : 'None'
          }
          description={
            flags.isConservationProperty
              ? `Conservation ${flags.conservationGrade} property. Façade and key architectural elements must be conserved. Any external alterations require ${flags.conservationAuthority} Conservation Plan approval.`
              : 'No URA or NHB conservation restrictions apply to this property.'
          }
        />

        <RiskFlag
          icon="🛣️"
          label="Road Reserve"
          severity={flags.hasRoadReserve ? 'red' : 'green'}
          badgeText={
            flags.hasRoadReserve
              ? `Confirmed — ~${flags.roadReserveAffectedSqft?.toLocaleString()} sqft affected`
              : 'None'
          }
          description={
            flags.hasRoadReserve
              ? (flags.roadReserveNotes ?? 'A road reserve has been identified on this plot. This area cannot be built over and reduces the usable land area.')
              : 'No road reserve identified on the land boundary. Verify against SLA survey plan before purchase.'
          }
        />
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Risk flag data is indicative only. Always verify with the relevant authorities (PUB, NParks, URA, LTA) and engage a qualified surveyor before transacting.
      </p>
    </div>
  );
}
