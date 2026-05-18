import type { PropertyType, Tenure } from '@/types';

export function formatPrice(sgd: number): string {
  if (sgd >= 1_000_000) return `SGD ${(sgd / 1_000_000).toFixed(2)}M`;
  if (sgd >= 1_000) return `SGD ${(sgd / 1_000).toFixed(0)}K`;
  return `SGD ${sgd.toLocaleString()}`;
}

export function formatPSF(psf: number): string {
  return `$${psf.toLocaleString()} psf`;
}

export function formatArea(sqft: number): string {
  const sqm = Math.round(sqft * 0.0929);
  return `${sqft.toLocaleString()} sqft (${sqm.toLocaleString()} sqm)`;
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });
}

export function formatPropertyType(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    terrace: 'Terrace House',
    semi_detached: 'Semi-Detached',
    bungalow: 'Bungalow',
    gcb: 'Good Class Bungalow',
    cluster: 'Cluster House',
    conservation: 'Conservation Property',
  };
  return labels[type] ?? type;
}

export function formatTenure(tenure: Tenure): string {
  const labels: Record<Tenure, string> = {
    freehold: 'Freehold',
    '999_leasehold': '999-Year Leasehold',
    '99_leasehold': '99-Year Leasehold',
  };
  return labels[tenure] ?? tenure;
}

export function formatDistrict(district: number): string {
  return `District ${district}`;
}
