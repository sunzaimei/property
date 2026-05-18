import type { OwnershipRules } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

function EligibilityCell({
  label,
  eligible,
  conditional,
  restriction,
}: {
  label: string;
  eligible: boolean;
  conditional?: boolean;
  restriction?: string | null;
}) {
  return (
    <div className={cn(
      'rounded-xl border p-4 text-center',
      eligible ? 'bg-green-50 border-green-200' : conditional ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
    )}>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</p>
      <span className="text-2xl">{eligible ? '✓' : '✗'}</span>
      <p className={cn(
        'text-xs font-bold mt-1',
        eligible ? 'text-green-700' : conditional ? 'text-amber-700' : 'text-red-700'
      )}>
        {eligible ? 'ELIGIBLE' : conditional ? 'CONDITIONAL' : 'RESTRICTED'}
      </p>
      {restriction && (
        <p className="text-xs text-gray-500 mt-2 text-left leading-relaxed">{restriction}</p>
      )}
    </div>
  );
}

function absdBadgeClass(rate: number): string {
  if (rate === 0) return 'bg-green-100 text-green-800';
  if (rate <= 5) return 'bg-lime-100 text-lime-800';
  if (rate <= 20) return 'bg-amber-100 text-amber-800';
  if (rate <= 30) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function OwnershipPanel({ rules }: { rules: OwnershipRules }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <SectionHeading icon="🏛️" title="Ownership Eligibility" subtitle="Residential Property Act & ABSD (as at Feb/Apr 2023)" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <EligibilityCell label="Singapore Citizen" eligible={rules.scEligible} />
        <EligibilityCell
          label="Permanent Resident"
          eligible={rules.prEligible}
          conditional={rules.requiresLandDealApproval}
        />
        <EligibilityCell
          label="Foreigner"
          eligible={rules.foreignerEligible}
          restriction={rules.foreignerRestrictions}
        />
      </div>

      {rules.specialConditions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Special Conditions</p>
          <ul className="space-y-1">
            {rules.specialConditions.map((c, i) => (
              <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">ABSD Rates</p>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {rules.absdRates.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
              <span className="text-xs text-gray-700">{r.buyerProfile}</span>
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', absdBadgeClass(r.ratePercent))}>
                {r.ratePercent}%
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">{rules.bsdNote}</p>
      </div>
    </div>
  );
}
