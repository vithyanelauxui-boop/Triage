import { useState } from 'react';
import { ArrowRight, ChevronRight, ShieldAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { AttentionItem, Severity } from '@/data/dashboard';

const severityMeta: Record<
  Exclude<Severity, 'routine'>,
  { rail: string; label: string; icon: React.ElementType; badge: 'critical' | 'warning' }
> = {
  critical: { rail: 'bg-critical', label: 'Critical', icon: ShieldAlert, badge: 'critical' },
  urgent: { rail: 'bg-warning', label: 'Urgent', icon: TriangleAlert, badge: 'warning' },
};

function AttentionRow({ item }: { item: AttentionItem }) {
  const meta = severityMeta[item.severity as Exclude<Severity, 'routine'>];
  const Icon = meta.icon;

  return (
    <li className="group relative flex items-start gap-3 py-3 pl-4 pr-3 transition-colors hover:bg-secondary/60">
      {/* Severity rail — encodes risk without flooding the row in colour */}
      <span className={cn('absolute inset-y-0 left-0 w-[3px]', meta.rail)} aria-hidden="true" />

      <Avatar className="mt-0.5 size-7">
        <AvatarFallback className="text-2xs">{item.initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium">{item.patientName}</span>
          <span className="num text-2xs text-muted-foreground">
            {item.age} yrs · {item.patientId}
          </span>
          <Badge variant={meta.badge} dot className="ml-auto">
            <Icon className="size-3" />
            {meta.label}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-foreground">{item.headline}</p>

        {/* The actual number is the clinical signal — give it real weight */}
        {item.value && (
          <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <span
              className={cn(
                'num rounded-xs px-1.5 py-0.5 text-sm font-semibold',
                item.severity === 'critical' ? 'bg-critical-bg text-critical' : 'bg-warning-bg text-warning',
              )}
            >
              {item.value}
            </span>
            {item.reference && (
              <span className="num text-2xs text-muted-foreground">{item.reference}</span>
            )}
          </div>
        )}

        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>

        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" variant={item.severity === 'critical' ? 'primary' : 'default'}>
            Review now
            <ArrowRight />
          </Button>
          <Button size="sm" variant="ghost" className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">
            Open chart
          </Button>
          <span className="num ml-auto text-2xs text-muted-foreground">{item.reportedMinsAgo} min ago</span>
        </div>
      </div>
    </li>
  );
}

export function AttentionPanel({
  items,
  counts,
}: {
  items: AttentionItem[];
  counts: { critical: number; urgent: number };
}) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'urgent'>('all');
  const visible = filter === 'all' ? items : items.filter((i) => i.severity === filter);
  const total = counts.critical + counts.urgent;

  const filters = [
    { id: 'all' as const, label: 'All', count: total },
    { id: 'critical' as const, label: 'Critical', count: counts.critical },
    { id: 'urgent' as const, label: 'Urgent', count: counts.urgent },
  ];

  return (
    <section
      className={cn(
        'overflow-hidden rounded-lg border bg-card',
        counts.critical > 0 ? 'border-critical-border' : 'border-border',
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5',
          counts.critical > 0 ? 'border-critical-border bg-critical-bg/50' : 'border-border',
        )}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className={cn('size-4', counts.critical > 0 ? 'text-critical' : 'text-muted-foreground')} />
          <h2 className="text-md font-medium">Needs your attention</h2>
          <span className="num text-xs text-muted-foreground">{total} open</span>
        </div>

        {/* Segmented filter keeps critical items one tap away, never buried */}
        <div className="flex items-center gap-1 rounded-sm border border-border bg-background p-0.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-xs px-2 py-1 text-xs transition-colors',
                filter === f.id
                  ? 'bg-secondary font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
              <span
                className={cn(
                  'num rounded-full px-1 text-2xs',
                  f.id === 'critical' && f.count > 0 && 'bg-critical text-white',
                  f.id === 'urgent' && f.count > 0 && 'bg-warning text-white',
                  f.id === 'all' && 'bg-border text-muted-foreground',
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-border">
        {visible.map((item) => (
          <AttentionRow key={item.id} item={item} />
        ))}
      </ul>

      <div className="border-t border-border px-4 py-2">
        <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground">
          View all {total} items
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </section>
  );
}
