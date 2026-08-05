import { createContext, useContext, useState, type ReactNode } from 'react';
import { ArrowUpRight, ShieldAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

// One canonical patient view every surface maps into, so a row-click always
// opens the same detail panel instead of scattering inline buttons everywhere.
export interface PatientView {
  name: string;
  id: string;
  age: number;
  initials: string;
  subtitle: string;
  severity?: 'critical' | 'urgent';
  value?: string;
  reference?: string;
  detail?: string;
  meta?: string;
  vitals?: { bp?: string; hr?: string; spo2?: string };
  primaryAction: string;
}

const Ctx = createContext<(p: PatientView) => void>(() => {});
export const usePatientSheet = () => useContext(Ctx);

const sevMeta = {
  critical: { label: 'Critical', icon: ShieldAlert, badge: 'critical' as const },
  urgent: { label: 'Urgent', icon: TriangleAlert, badge: 'warning' as const },
};

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="num text-sm font-medium">{value}</span>
    </div>
  );
}

export function PatientSheetProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<PatientView | null>(null);
  const open = (p: PatientView) => setPatient(p);
  const sev = patient?.severity ? sevMeta[patient.severity] : null;

  return (
    <Ctx.Provider value={open}>
      {children}
      <Sheet open={!!patient} onOpenChange={(o) => !o && setPatient(null)}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:w-[420px] sm:max-w-none">
          {patient && (
            <>
              <div className="border-b border-border p-5 text-left">
                <div className="flex items-start gap-3 pr-6">
                  <Avatar className="size-10">
                    <AvatarFallback className="text-sm">{patient.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <SheetTitle className="text-lg font-medium tracking-tight">{patient.name}</SheetTitle>
                    <p className="num text-sm text-muted-foreground">
                      {patient.age} yrs · {patient.id}
                    </p>
                  </div>
                  {sev && (
                    <Badge variant={sev.badge}>
                      <sev.icon className="size-3" />
                      {sev.label}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
                  {patient.meta ?? 'Reason for visit'}
                </p>
                <p className="mt-1 text-md">{patient.subtitle}</p>

                {patient.value && (
                  <div className="mt-3 flex items-baseline gap-2">
                    <span
                      className={cn(
                        'num rounded-sm px-2 py-1 text-lg font-semibold',
                        patient.severity === 'critical' ? 'bg-critical-bg text-critical' : 'bg-warning-bg text-warning',
                      )}
                    >
                      {patient.value}
                    </span>
                    {patient.reference && (
                      <span className="num text-sm text-muted-foreground">{patient.reference}</span>
                    )}
                  </div>
                )}

                {patient.detail && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{patient.detail}</p>
                )}

                {patient.vitals && (
                  <div className="mt-5 rounded-lg border border-border">
                    <div className="border-b border-border px-3 py-2">
                      <span className="text-2xs font-medium uppercase tracking-wide text-muted-foreground">Latest vitals</span>
                    </div>
                    <div className="divide-y divide-border px-3">
                      {patient.vitals.bp && <Line label="Blood pressure" value={patient.vitals.bp} />}
                      {patient.vitals.hr && <Line label="Heart rate" value={patient.vitals.hr} />}
                      {patient.vitals.spo2 && <Line label="SpO₂" value={patient.vitals.spo2} />}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border p-4">
                <Button variant="primary" size="lg" className="flex-1">
                  {patient.primaryAction}
                </Button>
                <Button variant="default" size="lg">
                  Open full chart
                  <ArrowUpRight />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Ctx.Provider>
  );
}
