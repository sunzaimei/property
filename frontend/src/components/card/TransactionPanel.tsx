import type { Transaction } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatPSF, formatDate } from '@/lib/formatters';

const buyerTypeVariant: Record<string, 'green' | 'blue' | 'orange' | 'violet'> = {
  SC:        'green',
  PR:        'blue',
  foreigner: 'orange',
  company:   'violet',
};

function PSFBars({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice(0, 5);
  const maxPsf = Math.max(...recent.flatMap(t => [t.psfLand, t.psfBuiltUp ?? 0]));

  return (
    <div className="mb-6">
      <p className="text-xs text-gray-500 mb-3 font-medium">PSF Comparison — Land vs Built-up (last {recent.length} transactions)</p>
      <div className="space-y-3">
        {recent.map(t => (
          <div key={t.id} className="space-y-1">
            <p className="text-xs text-gray-500">{formatDate(t.transactionDate)}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-16 text-right shrink-0">Land PSF</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(t.psfLand / maxPsf) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">${t.psfLand.toLocaleString()}</span>
                </div>
              </div>
            </div>
            {t.psfBuiltUp && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-16 text-right shrink-0">Built-up</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(t.psfBuiltUp / maxPsf) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">${t.psfBuiltUp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionPanel({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <SectionHeading icon="📊" title="Transaction History" />
        <p className="text-sm text-gray-400">No transaction records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <SectionHeading icon="📊" title="Transaction History" subtitle="Source: URA Private Residential Property Transactions" />
      <PSFBars transactions={transactions} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 text-xs text-gray-500 font-medium">Date</th>
              <th className="text-right pb-2 text-xs text-gray-500 font-medium">Sale Price</th>
              <th className="text-right pb-2 text-xs text-gray-500 font-medium hidden sm:table-cell">PSF (Land)</th>
              <th className="text-right pb-2 text-xs text-gray-500 font-medium hidden md:table-cell">PSF (Built-up)</th>
              <th className="text-center pb-2 text-xs text-gray-500 font-medium">Buyer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="py-2.5 text-gray-600">{formatDate(t.transactionDate)}</td>
                <td className="py-2.5 text-right font-semibold text-gray-900">{formatPrice(t.salePrice)}</td>
                <td className="py-2.5 text-right text-gray-700 hidden sm:table-cell">{formatPSF(t.psfLand)}</td>
                <td className="py-2.5 text-right text-gray-500 hidden md:table-cell">
                  {t.psfBuiltUp ? formatPSF(t.psfBuiltUp) : '—'}
                </td>
                <td className="py-2.5 text-center">
                  <Badge variant={buyerTypeVariant[t.buyerType] ?? 'gray'}>{t.buyerType}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
