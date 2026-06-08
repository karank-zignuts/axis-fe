'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, LogOut, RotateCcw, UserRound } from 'lucide-react';
import { AppShell } from '@/components/aiflow/AppShell';
import { GlassCard } from '@/components/aiflow/GlassCard';
import { HandNote } from '@/components/aiflow/Scribble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { resetOnboarding } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [loading, router, user]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleRedoOnboarding = async () => {
    setResetting(true);
    setError(null);

    try {
      await resetOnboarding();
      await refreshUser();
      router.replace('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset onboarding.');
    } finally {
      setResetting(false);
    }
  };

  if (loading || !user || !user.hasCompletedOnboarding) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <AppShell title="Settings">
      <GlassCard className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[160px_1fr]">
          <div>
            <div className="grid h-32 w-32 place-items-center rounded-3xl bg-foreground text-background">
              <UserRound className="h-12 w-12" />
            </div>
            <HandNote className="mt-3 block">trader profile</HandNote>
          </div>
          <div className="max-w-lg space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} readOnly className="bg-background/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly className="bg-background/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Onboarding</Label>
              <Input
                id="status"
                value={user.hasCompletedOnboarding ? 'Completed' : 'Not completed'}
                readOnly
                className="bg-background/60"
              />
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4">
              <div className="font-display text-lg font-bold">Redo onboarding</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Clear your previous trading profile and checklist, then generate a fresh plan.
              </p>
              <Button className="mt-4 rounded-full" onClick={handleRedoOnboarding} disabled={resetting}>
                {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                Start again
              </Button>
            </div>
            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button variant="destructive" className="rounded-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </GlassCard>
    </AppShell>
  );
}
