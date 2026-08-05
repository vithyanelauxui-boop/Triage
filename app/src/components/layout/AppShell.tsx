import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarDays,
  Users,
  FlaskConical,
  Pill,
  ListChecks,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
  Bell,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeft,
  Check,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { doctor } from '@/data/dashboard';

const NAV_PRIMARY = [
  { label: 'Dashboard', to: '/', icon: LayoutGrid },
  { label: 'Appointments', to: '/appointments', icon: CalendarDays },
  { label: 'Patients', to: '/patients', icon: Users },
];

const NAV_CLINICAL = [
  { label: 'Lab Results', to: '/lab-results', icon: FlaskConical, badge: '2' },
  { label: 'Prescriptions', to: '/prescriptions', icon: Pill },
  { label: 'Tasks', to: '/tasks', icon: ListChecks, badge: '5' },
];

const NAV_SECONDARY = [
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Messages', to: '/messages', icon: MessageSquare, badge: '3' },
];

function BrandMark() {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
        <path
          d="M2 9h2.5l1.5-4 2.5 8 2-5 1 1.5H14"
          stroke="#171717"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function NavItem({
  item,
  collapsed,
}: {
  item: { label: string; to: string; icon: React.ElementType; badge?: string };
  collapsed: boolean;
}) {
  const link = (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex h-8 items-center gap-2.5 rounded-sm px-2 text-sm transition-colors',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-secondary font-medium text-foreground'
            : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'absolute left-0 h-4 w-0.5 rounded-full bg-primary transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && (
            <>
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="default" className="ml-auto num">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function NavGroup({
  title,
  items,
  collapsed,
}: {
  title?: string;
  items: { label: string; to: string; icon: React.ElementType; badge?: string }[];
  collapsed: boolean;
}) {
  return (
    <div className="space-y-0.5">
      {title && !collapsed && (
        <p className="px-2 pb-1 pt-3 text-2xs font-medium uppercase tracking-wider text-muted-foreground/70">
          {title}
        </p>
      )}
      {title && collapsed && <div className="my-2 h-px bg-border" />}
      {items.map((item) => (
        <NavItem key={item.to} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

function DoctorMenu({ collapsed }: { collapsed: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-2 rounded-sm p-1.5 text-left transition-colors hover:bg-secondary',
            collapsed && 'justify-center p-1',
          )}
        >
          <Avatar className="size-6">
            <AvatarFallback className="bg-surface-night text-2xs text-white">{doctor.initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium leading-tight">{doctor.shortName}</p>
                <p className="flex items-center gap-1 text-2xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {doctor.status}
                </p>
              </div>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel>
          {doctor.name}
          <span className="block text-2xs">
            {doctor.specialty} · {doctor.room}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Duty status</DropdownMenuLabel>
        <DropdownMenuItem>
          <Check className="size-3.5 text-primary" /> Available
        </DropdownMenuItem>
        <DropdownMenuItem>With patient</DropdownMenuItem>
        <DropdownMenuItem>On break</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavBody({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <nav className={cn('flex-1 space-y-0.5 overflow-y-auto px-2 pb-3', collapsed && 'px-1.5')}>
        <NavGroup items={NAV_PRIMARY} collapsed={collapsed} />
        <NavGroup title="Clinical" items={NAV_CLINICAL} collapsed={collapsed} />
        <NavGroup title="Practice" items={NAV_SECONDARY} collapsed={collapsed} />
      </nav>

      <div className={cn('border-t border-border p-2', collapsed && 'px-1.5')}>
        <NavGroup items={[{ label: 'Settings', to: '/settings', icon: Settings }]} collapsed={collapsed} />
      </div>

      {/* Doctor identity + duty status — who is signing off matters clinically */}
      <div className={cn('border-t border-border p-2', collapsed && 'px-1.5')}>
        <DoctorMenu collapsed={collapsed} />
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle =
    [...NAV_PRIMARY, ...NAV_CLINICAL, ...NAV_SECONDARY].find((i) => i.to === location.pathname)?.label ??
    'Dashboard';

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 md:flex',
          collapsed ? 'w-[52px]' : 'w-[216px]',
        )}
      >
        <div className={cn('flex h-12 items-center gap-2 px-3', collapsed && 'justify-center px-0')}>
          <BrandMark />
          {!collapsed && <span className="text-md font-semibold tracking-tight">Predigle</span>}
        </div>

        <NavBody collapsed={collapsed} />
      </aside>

      {/* Mobile navigation — same nav model, reachable below md */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" onClick={() => setMobileOpen(false)}>
          <SheetTitle className="flex h-12 items-center gap-2 px-3 text-md font-semibold tracking-tight">
            <BrandMark />
            Predigle
          </SheetTitle>
          <NavBody collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-3">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:inline-flex"
          >
            {collapsed ? <PanelLeft /> : <PanelLeftClose />}
          </Button>

          <Button
            variant="ghost"
            size="iconSm"
            aria-label="Open navigation"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </Button>

          <span className="text-sm font-medium md:hidden">Predigle</span>
          <span className="hidden text-sm text-muted-foreground md:inline">{pageTitle}</span>

          {/* Global patient search — the doctor's fastest path to any record */}
          <div className="relative mx-auto w-full max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search patient, ID, or prescription"
              className="h-8 w-full rounded-sm border border-input bg-background pl-8 pr-12 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xs border border-border bg-secondary px-1 font-mono text-2xs text-muted-foreground sm:block">
              ⌘K
            </kbd>
          </div>

          <Button variant="ghost" size="iconSm" aria-label="Notifications" className="relative">
            <Bell />
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-critical" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
