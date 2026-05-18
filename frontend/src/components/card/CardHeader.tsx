import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatPropertyType, formatTenure, formatDistrict, formatArea } from '@/lib/formatters';

const typeVariant: Record<string, 'blue' | 'indigo' | 'violet' | 'amber' | 'teal' | 'rose'> = {
  terrace:       'blue',
  semi_detached: 'indigo',
  bungalow:      'violet',
  gcb:           'amber',
  cluster:       'teal',
  conservation:  'rose',
};

const tenureVariant: Record<string, 'green' | 'lime' | 'yellow'> = {
  freehold:        'green',
  '999_leasehold': 'lime',
  '99_leasehold':  'yellow',
};

export function CardHeader({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-wrap items-start gap-2 mb-3">
        <Badge variant={typeVariant[property.propertyType] ?? 'gray'}>
          {formatPropertyType(property.propertyType)}
        </Badge>
        <Badge variant={tenureVariant[property.tenure] ?? 'gray'}>
          {formatTenure(property.tenure)}
        </Badge>
        <Badge variant="gray">{formatDistrict(property.district)}</Badge>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.address}</h1>
      <p className="text-sm text-gray-500">Singapore {property.postalCode}</p>
      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
        <span>
          <span className="font-medium text-gray-800">Land: </span>
          {property.landAreaSqft > 0 ? formatArea(property.landAreaSqft) : <span className="text-gray-400 italic">Unknown</span>}
        </span>
        {property.builtUpSqft && (
          <span>
            <span className="font-medium text-gray-800">Built-up: </span>
            {formatArea(property.builtUpSqft)}
          </span>
        )}
      </div>
    </div>
  );
}
