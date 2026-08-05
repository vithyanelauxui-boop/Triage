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

function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 324 287" className={cn('size-6 shrink-0 text-foreground', className)} fill="currentColor" aria-label="Triage">
      <path d="M86.4354 0.535258C115.035 -2.73916 141.233 9.31163 161.723 28.4186C168.661 21.3238 176.684 15.3746 185.488 10.7911C207.807 -0.725486 233.774 -2.94131 257.719 4.62852C281.645 12.297 301.537 29.1612 313.022 51.5074C326.523 77.7765 325.649 108.442 316.772 136.032C306.884 167.156 285.063 193.09 256.083 208.15C225.854 223.44 190.805 226.16 158.579 215.716C128.322 205.89 103.188 184.478 88.6781 156.166C96.9081 151.658 105.637 147.229 113.969 142.81C121.497 155.692 128.295 164.771 140.192 173.906C180.727 205.031 243.554 197.821 274.296 156.332C289.038 136.433 296.943 109.82 293.779 84.9952C291.528 67.2892 281.245 53.1031 267.216 42.7145C265.424 41.4747 262.885 39.9479 260.932 38.9064C245.126 30.4737 226.62 28.6368 209.462 33.797C187.89 40.3644 172.006 56.7623 161.723 76.2374C148.748 53.3731 130.478 35.0182 103.067 31.5094C85.0404 29.0655 66.7865 33.9552 52.3949 45.0831C39.4359 55.2403 31.1039 70.1793 29.2704 86.5421C21.1498 157.307 89.5223 249.204 161.611 257.31L161.62 286.319C77.9848 278.453 7.94816 190.787 0.633215 110.287C-1.94638 81.901 3.02579 56.5504 21.6576 34.2565C37.8158 14.7364 61.1776 2.57481 86.4354 0.535258Z" />
      <path d="M58.7476 77.8384L132.973 77.8726L132.937 110.512L58.7906 110.42C58.583 99.7412 58.7481 88.5562 58.7476 77.8384Z" />
      <path d="M222.377 67.9414C236.874 65.188 250.854 74.7227 253.578 89.2232C256.303 103.724 246.742 117.684 232.235 120.382C217.768 123.074 203.856 113.544 201.137 99.082C198.417 84.6201 207.919 70.6875 222.377 67.9414Z" />
    </svg>
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
            ? 'bg-primary/10 font-medium text-primary'
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
                  <span className="size-1.5 rounded-full bg-success" />
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
      <nav className={cn('flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 pt-3', collapsed && 'px-1.5')}>
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Full-width top bar — brand, section context, global search, notifications.
          A polarity-flipped dark band (design.md's dark-surface pattern) that spans
          above both the sidebar and the content, rather than living inside either. */}
      <header className="flex h-12 shrink-0 items-center gap-4 bg-surface-night pr-4 text-white">
        {/* Brand column and separator are grouped with zero gap between them —
            the header's gap-4 applies *around* this pair, not inside it — so
            the separator sits flush on the sidebar's right border (md+), not
            offset by the flex gap. */}
        <div className="flex shrink-0 self-stretch">
          <div
            className={cn(
              'flex shrink-0 items-center gap-2 pl-4',
              collapsed ? 'md:w-[52px] md:justify-center md:pl-0' : 'md:w-[216px]',
            )}
          >
            <BrandMark className="text-white" />
            {!collapsed && <span className="text-md font-semibold tracking-tight">Triage</span>}
          </div>

          {/* Sized to match the search field's height, with rounded ends — a
              short pill-shaped rule rather than a full-height square-edged one. */}
          <div className="hidden h-8 w-[3px] shrink-0 self-center rounded-full bg-white/15 md:block" />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <PanelLeft /> : <PanelLeftClose />}
          </Button>
          <span className="text-sm text-white/70">{pageTitle}</span>
        </div>

        <Button
          variant="ghost"
          size="iconSm"
          aria-label="Open navigation"
          className="text-white/70 hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </Button>

        {/* Global patient search — the doctor's fastest path to any record */}
        <div className="relative mx-auto w-full max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/50" />
          <input
            placeholder="Search patient, ID, or prescription"
            className="h-8 w-full rounded-sm border border-white/10 bg-white/10 pl-8 pr-12 text-sm text-white placeholder:text-white/50 transition-colors hover:bg-white/[0.14] focus-visible:bg-white focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:placeholder:text-muted-foreground"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xs border border-white/15 bg-white/10 px-1 font-mono text-2xs text-white/60 sm:block">
            ⌘K
          </kbd>
        </div>

        <Button
          variant="ghost"
          size="iconSm"
          aria-label="Notifications"
          className="relative text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Bell />
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-critical ring-2 ring-surface-night" />
        </Button>
      </header>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            // White chrome, distinct from the gray app canvas the main column sits on —
            // matches the reference: sidebar and topbar are chrome, not canvas.
            // border-border resolves to #EBEBEB, per the reference.
            'hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex',
            collapsed ? 'w-[52px]' : 'w-[216px]',
          )}
        >
          <NavBody collapsed={collapsed} />
        </aside>

        {/* Mobile navigation — same nav model, reachable below md */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" onClick={() => setMobileOpen(false)}>
            <SheetTitle className="flex h-12 items-center gap-2 px-3 text-md font-semibold tracking-tight">
              <BrandMark />
              Triage
            </SheetTitle>
            <NavBody collapsed={false} />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
