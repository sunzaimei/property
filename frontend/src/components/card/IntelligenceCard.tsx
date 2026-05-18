'use client';
import dynamic from 'next/dynamic';
import type { PropertyIntelligenceCard } from '@/types';
import { CardHeader } from './CardHeader';
import { ZonePanel } from './ZonePanel';
import { DevelopmentParamsPanel } from './DevelopmentParamsPanel';
import { TransactionPanel } from './TransactionPanel';
import { OwnershipPanel } from './OwnershipPanel';
import { RiskFlagsPanel } from './RiskFlagsPanel';

// Leaflet requires window — must be no-SSR
const MapPanel = dynamic(() => import('./MapPanel'), { ssr: false });

interface Props {
  data: PropertyIntelligenceCard;
}

export function IntelligenceCard({ data }: Props) {
  const { property, uraZone, developmentParams, transactions, riskFlags, ownershipRules } = data;

  return (
    <div className="space-y-4">
      {/* Top: header + map side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardHeader property={property} />
        <MapPanel coordinates={property.coordinates} address={property.address} />
      </div>

      {/* Zone */}
      <ZonePanel zone={uraZone} />

      {/* Dev params */}
      <DevelopmentParamsPanel params={developmentParams} />

      {/* Transactions */}
      <TransactionPanel transactions={transactions} />

      {/* Ownership */}
      <OwnershipPanel rules={ownershipRules} />

      {/* Risk flags */}
      <RiskFlagsPanel flags={riskFlags} />

      <p className="text-xs text-center text-gray-400 pb-6">
        Data is for informational purposes only. Verify all information with relevant Singapore government agencies and a qualified property lawyer before transacting.
        Last updated: {new Date(data.lastUpdated).toLocaleDateString('en-SG', { dateStyle: 'medium' })}
      </p>
    </div>
  );
}
