import { ClinicOverviewCard } from '@/components/dashboard/ClinicOverviewCard';
import { AttentionPanel } from '@/components/dashboard/AttentionPanel';
import { NextPatientCard } from '@/components/dashboard/NextPatientCard';
import { ScheduleTable } from '@/components/dashboard/ScheduleTable';
import {
  PendingDecisionsCard,
  QuickActionsCard,
  RecentActivityCard,
} from '@/components/dashboard/SidePanels';
import { PatientSheetProvider } from '@/components/dashboard/PatientSheet';
import { attentionCounts, attentionItems, doctor, today } from '@/data/dashboard';

export function Dashboard() {
  return (
    <PatientSheetProvider>
    <div className="mx-auto max-w-[1400px] px-4 py-5 lg:px-6">
      <header className="mb-5">
        <h1 className="text-2xl font-medium tracking-tight">
          {today.greeting}, {doctor.shortName}
        </h1>
        <p className="num mt-0.5 text-sm text-muted-foreground">
          {today.dateLabel} · {today.timeLabel} · {doctor.specialty}, {doctor.room}
        </p>
      </header>

      <div className="space-y-4">
        {/* 1 — Is anyone in danger? Highest-stakes question gets the highest position. */}
        <AttentionPanel items={attentionItems} counts={attentionCounts} />

        {/* 2 — Is the clinic on track overall? */}
        <ClinicOverviewCard />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {/* 3 — Who am I seeing right now, and am I prepared? */}
            <NextPatientCard />
            {/* 4 — What does the rest of the day look like? Any row opens full prep. */}
            <ScheduleTable />
          </div>

          <div className="space-y-4">
            {/* 5 — What owes my signature? Async work that blocks other people. */}
            <PendingDecisionsCard />
            {/* 6 — What did I just do? Audit trail and fast undo. */}
            <RecentActivityCard />
            {/* 7 — Doctor-initiated shortcuts, deliberately last. */}
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
    </PatientSheetProvider>
  );
}
