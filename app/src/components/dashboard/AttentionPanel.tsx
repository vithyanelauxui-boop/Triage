import { useState } from 'react';
import { ChevronRight, ShieldAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePatientSheet } from './PatientSheet';
import type { AttentionItem, Severity } from '@/data/dashboard';

const severityMeta: Record<
  Exclude<Severity, 'routine'>,
  { label: string; icon: React.ElementType; badge: 'critical' | 'warning' }
> = {
  critical: { label: 'Critical', icon: ShieldAlert, badge: 'critical' },
  urgent: { label: 'Urgent', icon: TriangleAlert, badge: 'warning' },
};

function AttentionRow({ item }: { item: AttentionItem }) {
  const meta = severityMeta[item.severity as Exclude<Severity, 'routine'>];
  const Icon = meta.icon;
  const isCritical = item.severity === 'critical';
  const openPatient = usePatientSheet();

  return (
    <li
      onClick={() =>
        openPatient({
          name: item.patientName,
          id: item.patientId,
          age: item.age,
          initials: item.initials,
          subtitle: item.headline,
          meta: `${item.category} result`,
          severity: item.severity as 'critical' | 'urgent',
          value: item.value,
          reference: item.reference,
          detail: item.detail,
          primaryAction: isCritical ? 'Review result' : 'Open result',
        })
      }
      className="group flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary/70"
    >
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="text-2xs">{item.initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{item.patientName}</span>
          <span className="num shrink-0 text-2xs text-muted-foreground">{item.age} · {item.patientId}</span>
        </div>

        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="truncate text-sm text-foreground">{item.headline}</span>
          {item.value && (
            <span
              className={cn(
                'num shrink-0 rounded-full px-2 text-xs font-semibold',
                isCritical ? 'bg-critical-bg text-critical' : 'bg-warning-bg text-warning',
              )}
            >
              {item.value}
            </span>
          )}
        </div>
      </div>

      {/* Right cluster — all vertically centered on the row */}
      <Badge variant={meta.badge} className="shrink-0">
        <Icon className="size-3" />
        {meta.label}
      </Badge>
      <span className="num hidden w-9 shrink-0 text-right text-2xs text-muted-foreground sm:block">{item.reportedMinsAgo}m</span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
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
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className={cn('size-4', counts.critical > 0 ? 'text-critical' : 'text-muted-foreground')} />
          <h2 className="text-md font-medium">Needs your attention</h2>
          <span className="num text-xs text-muted-foreground">({total} open)</span>
        </div>

        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as typeof filter)}
        >
          {filters.map((f) => (
            <ToggleGroupItem key={f.id} value={f.id} className="gap-1.5 px-2">
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
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ul className="divide-y divide-border">
        {visible.map((item) => (
          <AttentionRow key={item.id} item={item} />
        ))}
      </ul>

      <div className="border-t border-border px-4 py-1.5">
        <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground">
          View all {total} items
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </section>
  );
}
