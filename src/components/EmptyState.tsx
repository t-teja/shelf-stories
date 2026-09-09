import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-16 text-center animate-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-soft)] text-stud-red">
        <PackageOpen size={28} />
      </div>
      <h3 className="font-display text-xl font-bold text-[var(--text)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">{hint}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
