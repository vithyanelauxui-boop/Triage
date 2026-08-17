import { useEffect, useRef, useState } from 'react';
import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Divider,
  Icon,
  Button,
  Popover,
  ActionList,
} from '@shopify/polaris';
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon } from '@shopify/polaris-icons';

interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helpText: string;
  deltaPct: number;
  goodDirection: 'up' | 'down' | 'neutral';
}

// Mirrors src/data/dashboard.ts's kpis — this bundle is isolated from the
// main app (see vite.config.ts), so the data is duplicated here rather
// than imported across the boundary.
const kpis: Kpi[] = [
  { id: 'patients', label: 'Patients today', value: '8', helpText: '3 waiting · 1 in progress', deltaPct: 14, goodDirection: 'neutral' },
  { id: 'critical', label: 'Critical results', value: '2', helpText: 'Unreviewed right now', deltaPct: 33, goodDirection: 'down' },
  { id: 'pending', label: 'Awaiting my sign-off', value: '4', helpText: '1 high priority', deltaPct: 25, goodDirection: 'down' },
  { id: 'wait', label: 'Avg. wait time', value: '12', unit: 'min', helpText: 'Target is under 15 min', deltaPct: 9, goodDirection: 'down' },
];

function verdict(kpi: Kpi): 'good' | 'bad' | 'neutral' {
  if (kpi.goodDirection === 'neutral' || kpi.deltaPct === 0) return 'neutral';
  const movedUp = kpi.deltaPct > 0;
  const isGood = kpi.goodDirection === 'up' ? movedUp : !movedUp;
  return isGood ? 'good' : 'bad';
}

function KpiColumn({ kpi, isFirst }: { kpi: Kpi; isFirst: boolean }) {
  const v = verdict(kpi);
  const tone = v === 'good' ? 'success' : v === 'bad' ? 'critical' : 'subdued';
  const DeltaIcon = kpi.deltaPct > 0 ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Box
      padding="400"
      minWidth="180px"
      borderInlineStartWidth={isFirst ? undefined : '025'}
      borderColor="border"
    >
      <BlockStack gap="150">
        <Text as="span" variant="bodySm" tone="subdued">
          {kpi.label}
        </Text>
        <InlineStack gap="150" blockAlign="baseline">
          <InlineStack gap="050" blockAlign="baseline">
            <Text as="span" variant="heading2xl">
              {kpi.value}
            </Text>
            {kpi.unit && (
              <Text as="span" variant="bodySm" tone="subdued">
                {kpi.unit}
              </Text>
            )}
          </InlineStack>
          {kpi.deltaPct !== 0 && (
            <InlineStack gap="0" blockAlign="center">
              <span style={{ width: 14, height: 14, display: 'inline-flex' }}>
                <Icon source={DeltaIcon} tone={tone} />
              </span>
              <Text as="span" variant="bodySm" tone={tone} fontWeight="medium">
                {Math.abs(kpi.deltaPct)}%
              </Text>
            </InlineStack>
          )}
        </InlineStack>
        <Text as="span" variant="bodySm" tone="subdued">
          {kpi.helpText}
        </Text>
      </BlockStack>
    </Box>
  );
}

export function ClinicOverviewCard() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [range, setRange] = useState('Today');
  const rootRef = useRef<HTMLDivElement>(null);

  // Auto-size the parent's iframe to this content's real height.
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const post = () => window.parent.postMessage({ type: 'polaris-kpi-height', height: el.scrollHeight }, '*');
    const observer = new ResizeObserver(post);
    observer.observe(el);
    post();
    return () => observer.disconnect();
  }, []);

  const rangeActivator = (
    <Button variant="tertiary" icon={CalendarIcon} disclosure onClick={() => setPopoverActive((v) => !v)}>
      {range}
    </Button>
  );

  return (
    <div ref={rootRef}>
      <Card padding="0">
        <Box padding="300" paddingInlineStart="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2" variant="headingSm">
              Clinic overview
            </Text>
            <Popover active={popoverActive} activator={rangeActivator} onClose={() => setPopoverActive(false)}>
              <ActionList
                items={['Today', 'Last 7 days', 'Last 30 days'].map((label) => ({
                  content: label,
                  active: label === range,
                  onAction: () => {
                    setRange(label);
                    setPopoverActive(false);
                  },
                }))}
              />
            </Popover>
          </InlineStack>
        </Box>
        <Divider />
        <Box overflowX="scroll">
          <InlineStack gap="0" wrap={false} blockAlign="stretch">
            {kpis.map((kpi, index) => (
              <KpiColumn key={kpi.id} kpi={kpi} isFirst={index === 0} />
            ))}
          </InlineStack>
        </Box>
      </Card>
    </div>
  );
}
