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
    <div className="flex flex-col items-center justify-center border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-20 text-center animate-in">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[var(--border)] text-[var(--text-muted)]">
        <PackageOpen size={24} strokeWidth={1.25} />
      </div>
      <div className="rule-rosso mx-auto mb-4" />
      <h3 className="font-display text-2xl font-medium tracking-wide text-[var(--text)]">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">{hint}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
