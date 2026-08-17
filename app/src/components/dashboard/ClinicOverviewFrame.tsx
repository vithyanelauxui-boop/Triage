import { useEffect, useRef, useState } from 'react';

/**
 * Embeds the real @shopify/polaris "Clinic overview" card via an isolated
 * iframe (see polaris-kpi.html / vite.config.ts). Polaris ships a global
 * stylesheet with its own html/body resets and font stack — importing it
 * directly into this app would leak into every other component built on
 * the Vercel/shadcn system. The iframe keeps it 100% real Polaris with
 * zero risk of that collision; height is synced via postMessage so it
 * reads as a normal card, not an embedded frame.
 */
export function ClinicOverviewFrame() {
  const [height, setHeight] = useState(180);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === 'polaris-kpi-height') {
        setHeight(event.data.height);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="./polaris-kpi.html"
      title="Clinic overview"
      style={{ height, width: '100%', border: 0, display: 'block' }}
    />
  );
}
