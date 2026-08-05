import { useState } from 'react';
import { CalendarDays, ChevronRight, ShieldAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePatientSheet } from './PatientSheet';
import { nextPatient, schedule, type ScheduleItem, type ScheduleStatus } from '@/data/dashboard';

const statusMeta: Record<
  ScheduleStatus,
  { label: string; variant: 'default' | 'critical' | 'warning' | 'success' | 'info'; action: string }
> = {
  waiting: { label: 'Waiting', variant: 'warning', action: 'Start consult' },
  'in-progress': { label: 'In progress', variant: 'info', action: 'Continue consult' },
  completed: { label: 'Completed', variant: 'success', action: 'View summary' },
  missed: { label: 'Missed', variant: 'critical', action: 'Reschedule' },
  confirmed: { label: 'Confirmed', variant: 'default', action: 'Start consult' },
};

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'waiting', label: 'Waiting' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'missed', label: 'Missed' },
] as const;

function count(status: string) {
  return status === 'all' ? schedule.length : schedule.filter((s) => s.status === status).length;
}

function Row({ item }: { item: ScheduleItem }) {
  const meta = statusMeta[item.status];
  const isDone = item.status === 'completed' || item.status === 'missed';
  const openPatient = usePatientSheet();

  return (
    <TableRow
      onClick={() =>
        openPatient({
          name: item.patientName,
          id: item.patientId,
          age: item.age,
          initials: item.initials,
          subtitle: item.reason,
          meta: `${item.time} · ${meta.label}`,
          severity: item.flag,
          detail: item.isUpNext
            ? `Waiting ${nextPatient.waitingMins} min · ${nextPatient.visitType} · ${nextPatient.openItems} pre-consult items to review. Allergies: ${nextPatient.allergies}.`
            : undefined,
          vitals: item.isUpNext ? nextPatient.vitals : undefined,
          primaryAction: meta.action,
        })
      }
      className={cn('group cursor-pointer', item.isUpNext && 'bg-secondary hover:bg-muted')}
    >
      <TableCell className="w-px whitespace-nowrap">
        <span className={cn('num text-sm', isDone ? 'text-muted-foreground' : 'font-medium')}>{item.time}</span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="text-2xs">{item.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={cn('truncate text-sm', isDone ? 'text-muted-foreground' : 'font-medium')}>
                {item.patientName}
              </span>
              {/* Risk flag travels with the patient — hover the icon for its severity */}
              {item.flag && (
                <Tooltip>
                  <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <span className="inline-flex cursor-default">
                      {item.flag === 'critical' ? (
                        <ShieldAlert className="size-3.5 shrink-0 text-critical" />
                      ) : (
                        <TriangleAlert className="size-3.5 shrink-0 text-warning" />
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{item.flag === 'critical' ? 'Critical' : 'Urgent'}</TooltipContent>
                </Tooltip>
              )}
              {item.isUpNext && (
                <Badge variant="emerald" className="ml-0.5">
                  Up next
                </Badge>
              )}
            </div>
            <p className="num truncate text-2xs text-muted-foreground">
              {item.age} yrs · {item.patientId}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">{item.reason}</TableCell>

      <TableCell className="w-px">
        <Badge variant={meta.variant} dot>
          {meta.label}
        </Badge>
      </TableCell>

      <TableCell className="w-px text-right">
        <ChevronRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
      </TableCell>
    </TableRow>
  );
}

export function ScheduleTable() {
  const [tab, setTab] = useState<string>('all');
  const rows = tab === 'all' ? schedule : schedule.filter((s) => s.status === tab);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-3">
        <h2 className="text-md font-medium">Today's schedule</h2>
        <Button variant="ghost" size="sm">
          <CalendarDays />
          Full calendar
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="px-4 pt-1">
          <TabsList className="w-full justify-start">
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
                <span
                  className={cn(
                    'num ml-1.5 rounded-full px-1.5 py-0.5 text-2xs font-semibold',
                    tab === t.id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {count(t.id)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {rows.length > 0 ? (
        <Table>
          <TableHeader>
            {/* border-strong so the header row reads as clearly separate from the
                data rows below, instead of blending into the first row's own
                faint divider. last:border-b overrides TableRow's own
                last:border-0 — this row is the sole child of <thead>, so it
                matches :last-child too and was silently losing its border
                width (color was set, but width collapsed to 0). */}
            <TableRow className="border-border-strong last:border-b hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-px" aria-label="Open" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No appointments in this view.</p>
        </div>
      )}
    </section>
  );
}
