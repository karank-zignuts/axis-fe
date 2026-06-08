'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Brain,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react';
import { BrandLink } from './BrandLink';
import { GlassCard } from './GlassCard';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard#plan', label: 'Plan', icon: ListChecks },
  { href: '/dashboard#risk', label: 'Risk Rules', icon: ShieldCheck },
  { href: '/dashboard#review', label: 'Review', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid w-[min(1400px,100%)] gap-6 md:grid-cols-[240px_1fr]">
        <aside className="glass h-fit rounded-3xl p-4 md:sticky md:top-6">
          <div className="px-2 py-2">
            <BrandLink />
          </div>
          <nav className="mt-4 space-y-1">
            {nav.map((item) => {
              const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 p-3 text-xs">
            <div className="font-display text-sm font-bold">Behavior first</div>
            <p className="mt-1 text-muted-foreground">
              Axis builds trading routines and guardrails, not market calls.
            </p>
            <div className="mt-3 flex items-center gap-2 text-accent">
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI planning active</span>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <GlassCard className="flex items-center gap-3 px-4 py-3">
            <h1 className="mr-auto font-display text-xl font-bold md:text-2xl">{title}</h1>
            <div className="hidden w-72 items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 md:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="h-6 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                placeholder="Search rules, notes, routines..."
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background sm:flex">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </GlassCard>

          {children}

          <div className="pt-4 text-center text-xs text-muted-foreground">
            Your edge is the process you can repeat when the chart gets loud.
          </div>
        </main>
      </div>
    </div>
  );
}
