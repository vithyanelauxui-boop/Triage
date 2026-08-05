import { ArrowRight, Clock, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { nextPatient } from '@/data/dashboard';

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'warning' }) {
  return (
    <div className="min-w-0">
      <p className="text-2xs text-muted-foreground">{label}</p>
      <p className={`num mt-0.5 truncate text-sm ${tone === 'warning' ? 'text-warning font-medium' : ''}`}>
        {value}
      </p>
    </div>
  );
}

export function NextPatientCard() {
  const p = nextPatient;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-xs font-medium text-muted-foreground">Up next</h2>
        <Badge variant="warning" dot>
          <Clock className="size-3" />
          Waiting {p.waitingMins} min
        </Badge>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-11">
              <AvatarFallback className="bg-surface-night text-sm text-white">{p.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="text-xl font-medium tracking-tight">{p.name}</h3>
              <p className="num text-xs text-muted-foreground">
                {p.age} yrs · {p.gender} · {p.id}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">{p.condition}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="default" size="lg">
              <FileText />
              Patient chart
            </Button>
            <Button variant="primary" size="lg">
              Start consultation
              <ArrowRight />
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="default">{p.appointmentTime}</Badge>
          {p.tags.map((t) => (
            <Badge key={t} variant="default">
              {t}
            </Badge>
          ))}
        </div>

        {/* Pre-consult context: everything the doctor would otherwise open 4 screens for */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Blood pressure" value={p.vitals.bp} tone="warning" />
          <Stat label="Heart rate" value={p.vitals.hr} />
          <Stat label="SpO₂" value={p.vitals.spo2} />
          <Stat label="Allergies" value={p.allergies} />
          <Stat label="Last visit" value={p.lastVisit} />
          <Stat label="Insurance" value={p.insurance} />
        </div>

        {p.openItems > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-sm border border-warning-border bg-warning-bg px-2.5 py-1.5">
            <ShieldCheck className="size-3.5 shrink-0 text-warning" />
            <p className="text-xs text-warning">
              {p.openItems} items need review before this consult — CT angiography and imaging approval.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
