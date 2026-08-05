import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TooltipProvider delayDuration={200}>
        <App />
      </TooltipProvider>
    </HashRouter>
  </StrictMode>,
);
