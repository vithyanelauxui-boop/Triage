export type Severity = 'critical' | 'urgent' | 'routine';
export type ScheduleStatus = 'waiting' | 'in-progress' | 'completed' | 'missed' | 'confirmed';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helpText: string;
  trend: number[];
  deltaPct: number;
  goodDirection: 'up' | 'down' | 'neutral';
}

export interface AttentionItem {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  initials: string;
  severity: Severity;
  category: 'Lab' | 'Imaging' | 'Vitals';
  headline: string;
  value?: string;
  reference?: string;
  detail: string;
  reportedMinsAgo: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  age: number;
  initials: string;
  reason: string;
  status: ScheduleStatus;
  isUpNext?: boolean;
  flag?: 'critical' | 'urgent';
}

export interface PendingDecision {
  id: string;
  action: string;
  patientName: string;
  detail: string;
  priority: 'High' | 'Medium' | 'Low';
  dueLabel: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  patientName: string;
  minsAgo: number;
  undoable?: boolean;
}

export const doctor = {
  name: 'Dr. Anand Vijayan',
  shortName: 'Dr. Vijayan',
  initials: 'AV',
  specialty: 'Cardiology',
  room: 'Room 4B',
  status: 'Available' as const,
};

export const today = {
  dateLabel: 'Tuesday, 5 August 2026',
  timeLabel: '09:15 AM',
  greeting: 'Good morning',
};

export const kpis: Kpi[] = [
  {
    id: 'patients',
    label: 'Patients today',
    value: '8',
    helpText: '3 waiting · 1 in progress',
    trend: [5, 7, 6, 9, 8, 7, 8],
    deltaPct: 14,
    goodDirection: 'neutral',
  },
  {
    id: 'critical',
    label: 'Critical results',
    value: '2',
    helpText: 'Unreviewed right now',
    trend: [1, 0, 2, 1, 1, 3, 2],
    deltaPct: -33,
    goodDirection: 'down',
  },
  {
    id: 'pending',
    label: 'Awaiting my sign-off',
    value: '5',
    helpText: '1 high priority',
    trend: [8, 6, 7, 5, 6, 4, 5],
    deltaPct: 25,
    goodDirection: 'down',
  },
  {
    id: 'wait',
    label: 'Avg. wait time',
    value: '12',
    unit: 'min',
    helpText: 'Target is under 15 min',
    trend: [18, 16, 15, 14, 13, 11, 12],
    deltaPct: 9,
    goodDirection: 'down',
  },
];

export const attentionItems: AttentionItem[] = [
  {
    id: 'att-1',
    patientName: 'Raj Patel',
    patientId: 'PT-7821',
    age: 45,
    initials: 'RP',
    severity: 'critical',
    category: 'Lab',
    headline: 'Serum potassium critically high',
    value: '6.2 mmol/L',
    reference: 'Ref 3.5–5.1',
    detail: 'Hyperkalemia range. Repeat draw and 12-lead ECG advised before the 10:00 consult.',
    reportedMinsAgo: 12,
  },
  {
    id: 'att-2',
    patientName: 'Arjun Singh',
    patientId: 'PT-5510',
    age: 58,
    initials: 'AS',
    severity: 'critical',
    category: 'Vitals',
    headline: 'Post-angioplasty BP climbing',
    value: '178/104 mmHg',
    reference: 'Last 3 readings rising',
    detail: 'Currently in consult. Review before any discharge decision is made.',
    reportedMinsAgo: 6,
  },
  {
    id: 'att-3',
    patientName: 'Maria Garcia',
    patientId: 'PT-6654',
    age: 62,
    initials: 'MG',
    severity: 'urgent',
    category: 'Imaging',
    headline: 'CT coronary angiography ready for review',
    detail: 'Radiologist correlation complete. Needed before her 09:30 consult.',
    reportedMinsAgo: 25,
  },
  {
    id: 'att-4',
    patientName: 'Sunita Kapoor',
    patientId: 'PT-3321',
    age: 47,
    initials: 'SK',
    severity: 'urgent',
    category: 'Lab',
    headline: 'HbA1c above target',
    value: '8.4%',
    reference: 'Ref < 7.0',
    detail: 'Glycaemic control worsening since April. Consider regimen change at 11:00.',
    reportedMinsAgo: 48,
  },
];

export const attentionCounts = { critical: 2, urgent: 6 };

export const nextPatient = {
  name: 'Maria Garcia',
  id: 'PT-6654',
  age: 62,
  gender: 'Female',
  initials: 'MG',
  condition: 'Essential hypertension',
  waitingMins: 12,
  appointmentTime: '09:30 AM',
  visitType: 'Follow-up',
  tags: ['Follow-up', 'High BP', 'CT pending'],
  lastVisit: '20 Jul 2026',
  vitals: { bp: '140/90', hr: '82 bpm', spo2: '97%' },
  allergies: 'None recorded',
  insurance: 'Apollo Health',
  openItems: 2,
};

export const schedule: ScheduleItem[] = [
  { id: 's-1', time: '08:00', patientName: 'Farooq Ahmed', patientId: 'PT-1187', age: 71, initials: 'FA', reason: 'Post-op review', status: 'completed' },
  { id: 's-2', time: '08:30', patientName: 'Divya Menon', patientId: 'PT-2290', age: 39, initials: 'DM', reason: 'Palpitations', status: 'completed' },
  { id: 's-3', time: '09:00', patientName: 'Latha Iyer', patientId: 'PT-4432', age: 55, initials: 'LI', reason: 'Annual checkup', status: 'missed' },
  { id: 's-4', time: '09:30', patientName: 'Maria Garcia', patientId: 'PT-6654', age: 62, initials: 'MG', reason: 'Hypertension', status: 'waiting', isUpNext: true, flag: 'urgent' },
  { id: 's-5', time: '10:00', patientName: 'Raj Patel', patientId: 'PT-7821', age: 45, initials: 'RP', reason: 'Chest pain', status: 'waiting', flag: 'critical' },
  { id: 's-6', time: '10:30', patientName: 'Arjun Singh', patientId: 'PT-5510', age: 58, initials: 'AS', reason: 'Post angioplasty', status: 'in-progress', flag: 'critical' },
  { id: 's-7', time: '11:00', patientName: 'Sunita Kapoor', patientId: 'PT-3321', age: 47, initials: 'SK', reason: 'Diabetes', status: 'waiting', flag: 'urgent' },
  { id: 's-8', time: '11:30', patientName: 'Ramesh Kumar', patientId: 'PT-9087', age: 65, initials: 'RK', reason: 'Follow-up', status: 'confirmed' },
];

export const pendingDecisions: PendingDecision[] = [
  { id: 'pd-2', action: 'Approve imaging', patientName: 'Maria Garcia', detail: 'CT coronary angiography', priority: 'Medium', dueLabel: 'Before 09:30' },
  { id: 'pd-3', action: 'Discharge review', patientName: 'Arjun Singh', detail: 'Post angioplasty', priority: 'Medium', dueLabel: 'Today' },
  { id: 'pd-4', action: 'Renew prescription', patientName: 'Sunita Kapoor', detail: 'Atorvastatin 40 mg', priority: 'Low', dueLabel: 'This week' },
  { id: 'pd-5', action: 'Call patient', patientName: 'Ramesh Kumar', detail: 'Discuss test results', priority: 'Low', dueLabel: 'This week' },
];

export const recentActivity: ActivityItem[] = [
  { id: 'ac-1', action: 'Signed lab report', patientName: 'Divya Menon', minsAgo: 8, undoable: true },
  { id: 'ac-2', action: 'Approved imaging request', patientName: 'Farooq Ahmed', minsAgo: 35 },
  { id: 'ac-3', action: 'Renewed Metformin 500 mg', patientName: 'Latha Iyer', minsAgo: 58 },
  { id: 'ac-4', action: 'Referred to Endocrinology', patientName: 'Sunita Kapoor', minsAgo: 92 },
];
