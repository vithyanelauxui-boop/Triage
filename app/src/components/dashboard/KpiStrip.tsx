import { ArrowDown, ArrowUp, ChevronDown, Minus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Kpi } from '@/data/dashboard';

function verdict(kpi: Kpi): 'good' | 'bad' | 'neutral' {
  if (kpi.goodDirection === 'neutral' || kpi.deltaPct === 0) return 'neutral';
  const movedUp = kpi.deltaPct > 0;
  const isGood = kpi.goodDirection === 'up' ? movedUp : !movedUp;
  return isGood ? 'good' : 'bad';
}

function KpiCell({ kpi, isFirst }: { kpi: Kpi; isFirst: boolean }) {
  const v = verdict(kpi);
  const DeltaIcon = kpi.deltaPct > 0 ? ArrowUp : kpi.deltaPct < 0 ? ArrowDown : Minus;

  const stroke =
    v === 'good' ? 'hsl(var(--success))' : v === 'bad' ? 'hsl(var(--critical))' : 'hsl(var(--muted-foreground))';

  const data = kpi.trend.map((value, i) => ({ i, value }));
  const gradientId = `kpi-grad-${kpi.id}`;

  return (
    <div
      className={cn(
        'group relative flex min-w-[190px] flex-1 flex-col gap-2 px-4 py-3.5',
        !isFirst && 'md:border-l md:border-border',
      )}
    >
      <p className="text-xs text-muted-foreground">{kpi.label}</p>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="num text-3xl font-medium leading-none tracking-tight">{kpi.value}</span>
          {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
        </div>

        <span
          className={cn(
            'num flex items-center gap-0.5 pb-0.5 text-xs font-medium',
            v === 'good' && 'text-success',
            v === 'bad' && 'text-critical',
            v === 'neutral' && 'text-muted-foreground',
          )}
        >
          <DeltaIcon className="size-3" strokeWidth={2.5} />
          {Math.abs(kpi.deltaPct)}%
        </span>
      </div>

      {/* 7-day trend — a number without direction can't be judged */}
      <div className="h-9 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 2, bottom: 5, left: 2 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-2xs text-muted-foreground">{kpi.helpText}</p>
    </div>
  );
}

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-xs font-medium text-muted-foreground">Clinic overview</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Today
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Today</DropdownMenuItem>
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col divide-y divide-border md:flex-row md:divide-y-0">
        {kpis.map((kpi, i) => (
          <KpiCell key={kpi.id} kpi={kpi} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}
