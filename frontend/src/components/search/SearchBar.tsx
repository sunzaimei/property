'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertySearch } from '@/hooks/usePropertySearch';
import { SearchSuggestions } from './SearchSuggestions';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { results, isLoading } = usePropertySearch(query);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(query.length > 1 && (results.length > 0 || isLoading));
  }, [query, results, isLoading]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(id: string) {
    setOpen(false);
    setQuery('');
    router.push(`/property/${id}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && results.length > 0 && setOpen(true)}
          placeholder="Search by address, street or postal code..."
          className="w-full pl-11 pr-4 py-4 text-base bg-white border-0 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-gray-900"
        />
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Searching...</span>
        )}
      </div>
      {open && (
        <SearchSuggestions results={results} onSelect={handleSelect} />
      )}
    </div>
  );
}
