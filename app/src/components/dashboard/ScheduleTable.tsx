import { useState } from 'react';
import { CalendarDays, ShieldAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { schedule, type ScheduleItem, type ScheduleStatus } from '@/data/dashboard';

const statusMeta: Record<
  ScheduleStatus,
  { label: string; variant: 'default' | 'critical' | 'warning' | 'success' | 'info'; action: string }
> = {
  waiting: { label: 'Waiting', variant: 'warning', action: 'Start' },
  'in-progress': { label: 'In progress', variant: 'info', action: 'Continue' },
  completed: { label: 'Completed', variant: 'success', action: 'View summary' },
  missed: { label: 'Missed', variant: 'critical', action: 'Reschedule' },
  confirmed: { label: 'Confirmed', variant: 'default', action: 'Start' },
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

  return (
    <TableRow className={cn(item.isUpNext && 'bg-primary/[0.06] hover:bg-primary/[0.09]')}>
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
              {/* Risk flag travels with the patient into every view */}
              {item.flag === 'critical' && <ShieldAlert className="size-3.5 shrink-0 text-critical" />}
              {item.flag === 'urgent' && <TriangleAlert className="size-3.5 shrink-0 text-warning" />}
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
        {/* Actions reveal on hover — keeps 8 rows scannable instead of 8 competing buttons */}
        <div
          className={cn(
            'transition-opacity',
            item.isUpNext || item.status === 'in-progress'
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          )}
        >
          <Button size="sm" variant={item.isUpNext || item.status === 'in-progress' ? 'primary' : 'default'}>
            {meta.action}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ScheduleTable() {
  const [tab, setTab] = useState<string>('all');
  const rows = tab === 'all' ? schedule : schedule.filter((s) => s.status === tab);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
        <h2 className="text-md font-medium">Today's schedule</h2>
        <Button variant="ghost" size="sm">
          <CalendarDays />
          Full calendar
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="px-4">
          <TabsList className="w-full justify-start">
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
                <span className="num ml-1.5 text-muted-foreground">{count(t.id)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {rows.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
