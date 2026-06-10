const STAR_PATH =
  "M12 2l2.92 6.26 6.87.84-5.07 4.7 1.33 6.79L12 17.27l-6.05 3.32 1.33-6.79-5.07-4.7 6.87-.84L12 2z";

function StarRow({ className }: { className?: string }) {
  return (
    <span className={`flex ${className ?? ""}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export default function Stars({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className="relative inline-block shrink-0"
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <StarRow className="text-slate-700" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <StarRow className="text-amber-400" />
      </span>
    </span>
  );
}
