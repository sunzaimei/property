import { cn } from '@/lib/utils';

type Variant = 'green' | 'amber' | 'red' | 'blue' | 'indigo' | 'violet' | 'teal' | 'rose' | 'lime' | 'yellow' | 'orange' | 'gray';

const variantClasses: Record<Variant, string> = {
  green:  'bg-green-100 text-green-800',
  amber:  'bg-amber-100 text-amber-900',
  red:    'bg-red-100 text-red-800',
  blue:   'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  violet: 'bg-violet-100 text-violet-800',
  teal:   'bg-teal-100 text-teal-800',
  rose:   'bg-rose-100 text-rose-800',
  lime:   'bg-lime-100 text-lime-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  orange: 'bg-orange-100 text-orange-800',
  gray:   'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
