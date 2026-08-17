import { Activity, AlertTriangle, Calendar, ChevronDown, ClipboardCheck, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

type DotTone = 'warning' | 'info' | 'critical' | 'muted';

const dotClass: Record<DotTone, string> = {
  warning: 'bg-warning',
  info: 'bg-info',
  critical: 'bg-critical',
  muted: 'bg-muted-foreground/50',
};

function Bullet({ tone, children }: { tone: DotTone; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('size-2 shrink-0 rounded-full', dotClass[tone])} />
      <span className="text-2xs text-muted-foreground">{children}</span>
    </div>
  );
}

function Column({
  icon: Icon,
  label,
  value,
  unit,
  isFirst,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit?: string;
  isFirst: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex min-w-[190px] flex-1 flex-col gap-2.5 px-4 py-3.5', !isFirst && 'md:border-l md:border-border')}>
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        </span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="num text-3xl font-medium leading-none tracking-tight">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {children}
    </div>
  );
}

export function ClinicOverviewCard() {
  const waitMins = 12;
  const targetMins = 15;
  const waitPercent = (waitMins / targetMins) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <CardTitle>Clinic overview</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Calendar />
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
      </CardHeader>

      <div className="flex flex-col divide-y divide-border md:flex-row md:divide-y-0">
        <Column icon={Users} label="Patients today" value="8" isFirst>
          <div className="flex flex-col gap-1">
            <Bullet tone="warning">3 waiting</Bullet>
            <Bullet tone="info">1 in progress</Bullet>
          </div>
        </Column>

        <Column icon={AlertTriangle} label="Critical results" value="2" isFirst={false}>
          <Bullet tone="critical">Unreviewed right now</Bullet>
        </Column>

        <Column icon={ClipboardCheck} label="Awaiting my sign-off" value="4" isFirst={false}>
          <Bullet tone="muted">1 high priority</Bullet>
        </Column>

        <Column icon={Clock} label="Avg. wait time" value={String(waitMins)} unit="min" isFirst={false}>
          <div className="flex flex-col gap-1.5">
            <Progress value={waitPercent} indicatorClassName="bg-success" />
            <p className="text-2xs text-muted-foreground">Clinic target: {targetMins} min</p>
          </div>
        </Column>
      </div>
    </Card>
  );
}
