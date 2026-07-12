export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant border-t-2 border-t-metallic-gold p-4">
      <p className="font-label text-label-sm text-slate-gray uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-headline text-headline-md text-deep-navy">{value}</p>
      {sub ? <p className="font-body text-body-sm text-slate-gray mt-1">{sub}</p> : null}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant p-5 ${className}`}>
      <h2 className="font-headline text-body-lg font-bold text-on-surface mb-4">{title}</h2>
      {children}
    </div>
  );
}

export function Bar({ label, value, max, unit = "" }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between font-body text-body-sm text-on-surface-variant mb-1">
        <span>{label}</span>
        <span className="font-label text-label-sm">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 bg-surface-container rounded-full overflow-hidden">
        <div className="h-full bg-metallic-gold rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ModuleNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-body-sm text-slate-gray italic mt-6 border-t border-outline-variant pt-4">
      {children}
    </p>
  );
}
