import { cn } from '@/lib/utils';

type Severity = 'green' | 'amber' | 'red';

const severityClasses: Record<Severity, { wrapper: string; badge: string }> = {
  green: { wrapper: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800' },
  amber: { wrapper: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-900' },
  red:   { wrapper: 'bg-red-50 border-red-200',     badge: 'bg-red-100 text-red-800' },
};

interface RiskFlagProps {
  icon: React.ReactNode;
  label: string;
  severity: Severity;
  badgeText: string;
  description: string;
}

export function RiskFlag({ icon, label, severity, badgeText, description }: RiskFlagProps) {
  const s = severityClasses[severity];
  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border', s.wrapper)}>
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s.badge)}>{badgeText}</span>
        </div>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}
