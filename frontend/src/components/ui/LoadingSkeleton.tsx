export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl p-6 h-32" />
      ))}
    </div>
  );
}
