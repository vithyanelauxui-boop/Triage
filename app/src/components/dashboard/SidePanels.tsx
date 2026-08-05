import {
  CalendarPlus,
  ChevronRight,
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
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { usePatientSheet } from './PatientSheet';
import { pendingDecisions, recentActivity } from '@/data/dashboard';

const priorityVariant = { High: 'critical', Medium: 'warning', Low: 'default' } as const;

const initialsOf = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function PendingDecisionsCard() {
  const openPatient = usePatientSheet();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm">
          Awaiting my sign-off{' '}
          <span className="num font-normal text-muted-foreground">({pendingDecisions.length})</span>
        </CardTitle>
      </CardHeader>

      <ul className="divide-y divide-border">
        {pendingDecisions.map((d) => (
          <li
            key={d.id}
            onClick={() =>
              openPatient({
                name: d.patientName,
                initials: initialsOf(d.patientName),
                subtitle: d.detail,
                meta: d.action,
                detail: `Due: ${d.dueLabel}. Priority ${d.priority.toLowerCase()}.`,
                primaryAction: d.action,
              })
            }
            className="group flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary/60"
          >
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
            <Badge variant={priorityVariant[d.priority]} className="shrink-0">{d.priority}</Badge>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
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
        {/* Connector runs through the exact centre of the 6px dots (16px pad + 3px half) */}
        <span className="absolute bottom-4 left-[18.5px] top-4 w-px bg-border" aria-hidden="true" />
        {recentActivity.map((a) => (
          <li key={a.id} className="group relative flex gap-3 py-1.5">
            <span className="relative z-10 mt-1.5 flex size-1.5 shrink-0 items-center justify-center rounded-full bg-border-strong ring-4 ring-card" />
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
      {/* Vercel's own command menu (cmdk) as a static 2-up grid: arrow-key
          navigation + Enter-to-select come for free, matching the palette
          interaction model doctors already get from Cmd+K search. */}
      <Command shouldFilter={false} loop>
        {/* Visually hidden but focusable: gives keyboard users a real tab
            stop to land on, so arrow keys + Enter drive selection the same
            way they do in Vercel's own command menu. */}
        <CommandInput aria-label="Quick actions" className="sr-only h-0 border-0 p-0" tabIndex={0} />
        <CommandList className="max-h-none">
          <CommandGroup className="grid grid-cols-2 gap-px bg-border p-0 [&_[cmdk-group-items]]:contents">
            {quickActions.map((a) => (
              <CommandItem
                key={a.label}
                value={a.label}
                onSelect={() => {}}
                className="rounded-none bg-card py-2.5 data-[selected=true]:bg-secondary"
              >
                <a.icon strokeWidth={1.75} />
                <span className="truncate">{a.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </Card>
  );
}
