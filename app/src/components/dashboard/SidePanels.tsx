import {
  CalendarPlus,
  ClipboardPlus,
  FilePlus2,
  FlaskConical,
  RotateCcw,
  UserPlus,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { pendingDecisions, recentActivity } from '@/data/dashboard';

const priorityVariant = { High: 'critical', Medium: 'warning', Low: 'default' } as const;

export function PendingDecisionsCard() {
  const high = pendingDecisions.filter((d) => d.priority === 'High').length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm">Awaiting my sign-off</CardTitle>
        <div className="flex items-center gap-1.5">
          {high > 0 && <Badge variant="critical">{high} high</Badge>}
          <span className="num text-xs text-muted-foreground">{pendingDecisions.length}</span>
        </div>
      </CardHeader>

      <ul className="divide-y divide-border">
        {pendingDecisions.map((d) => (
          <li key={d.id} className="group flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-secondary/60">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="font-medium">{d.action}</span>
                <span className="text-muted-foreground"> — {d.patientName}</span>
              </p>
              <p className="truncate text-2xs text-muted-foreground">{d.detail}</p>
              <p
                className={cn(
                  'num mt-0.5 text-2xs',
                  d.priority === 'High' ? 'text-critical' : 'text-muted-foreground',
                )}
              >
                {d.dueLabel}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge variant={priorityVariant[d.priority]}>{d.priority}</Badge>
              <Button
                size="xs"
                variant="default"
                className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                Open
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecentActivityCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm">Recent activity</CardTitle>
        <span className="text-2xs text-muted-foreground">Last 2 hours</span>
      </CardHeader>

      {/* Audit trail: confirms what was signed, and lets a mistake be caught fast */}
      <ol className="relative px-4 py-3">
        <span className="absolute bottom-4 left-[21px] top-4 w-px bg-border" aria-hidden="true" />
        {recentActivity.map((a) => (
          <li key={a.id} className="group relative flex gap-3 py-1.5">
            <span className="relative z-10 mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong ring-4 ring-card" />
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug">
                {a.action} — <span className="font-medium">{a.patientName}</span>
              </p>
              <p className="num text-2xs text-muted-foreground">{a.minsAgo} min ago</p>
            </div>
            {a.undoable && (
              <Button
                size="xs"
                variant="ghost"
                className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <RotateCcw />
                Undo
              </Button>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

const quickActions = [
  { label: 'New prescription', icon: ClipboardPlus },
  { label: 'Clinical note', icon: FilePlus2 },
  { label: 'Order lab test', icon: FlaskConical },
  { label: 'Refer patient', icon: Users },
  { label: 'Schedule follow-up', icon: CalendarPlus },
  { label: 'Add walk-in', icon: UserPlus },
];

export function QuickActionsCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm">Quick actions</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-px bg-border">
        {quickActions.map((a) => (
          <button
            key={a.label}
            className="flex items-center gap-2 bg-card px-3 py-2.5 text-left text-xs transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
          >
            <a.icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
