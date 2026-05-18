import type { PropertyIntelligenceCard, SearchResult, Transaction } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function searchProperties(q: string): Promise<SearchResult[]> {
  if (!q.trim()) return [];
  const res = await fetch(`${BASE_URL}/api/property/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function getPropertyCard(id: string): Promise<PropertyIntelligenceCard> {
  const res = await fetch(`${BASE_URL}/api/property/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Property ${id} not found`);
  return res.json();
}

export async function getTransactions(id: string): Promise<Transaction[]> {
  const res = await fetch(`${BASE_URL}/api/property/${id}/transactions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Transactions not found');
  return res.json();
}
