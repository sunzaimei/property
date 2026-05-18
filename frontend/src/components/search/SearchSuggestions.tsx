import type { SearchResult } from '@/types';
import { formatPropertyType } from '@/lib/formatters';

const typeColors: Record<string, string> = {
  terrace:       'text-blue-600',
  semi_detached: 'text-indigo-600',
  bungalow:      'text-violet-600',
  gcb:           'text-amber-700',
  cluster:       'text-teal-600',
  conservation:  'text-rose-600',
};

interface Props {
  results: SearchResult[];
  onSelect: (id: string) => void;
}

export function SearchSuggestions({ results, onSelect }: Props) {
  if (results.length === 0) return null;
  return (
    <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {results.map(r => (
        <li key={r.id}>
          <button
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
            onClick={() => onSelect(r.id)}
          >
            <span className="flex-1 text-sm font-medium text-gray-900 truncate">{r.address}</span>
            <span className={`text-xs font-medium shrink-0 ${typeColors[r.propertyType] ?? 'text-gray-500'}`}>
              {formatPropertyType(r.propertyType)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
