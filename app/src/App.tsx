import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

const PLACEHOLDERS = [
  ['/appointments', 'Appointments'],
  ['/patients', 'Patients'],
  ['/lab-results', 'Lab Results'],
  ['/prescriptions', 'Prescriptions'],
  ['/tasks', 'Tasks'],
  ['/reports', 'Reports'],
  ['/messages', 'Messages'],
  ['/settings', 'Settings'],
] as const;

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {PLACEHOLDERS.map(([path, title]) => (
          <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
