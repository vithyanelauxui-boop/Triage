import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { ClinicOverviewCard } from './ClinicOverviewCard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider i18n={en}>
      <ClinicOverviewCard />
    </AppProvider>
  </StrictMode>,
);
