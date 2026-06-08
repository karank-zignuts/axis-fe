'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Brain, CheckCircle2, Flame, Loader2, ShieldCheck, Target } from 'lucide-react';
import { AppShell } from '@/components/aiflow/AppShell';
import { GlassCard } from '@/components/aiflow/GlassCard';
import { HandNote } from '@/components/aiflow/Scribble';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { getChecklist, updateChecklistItem } from '@/lib/api';
import type { ChecklistItem } from '@/types';

const greetings = [
  'Welcome back, trader.',
  'Protect the process today.',
  'The best trade may be no trade.',
  'Your rules arrived before your impulse.',
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

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

  useEffect(() => {
    if (!user?.hasCompletedOnboarding) {
      return;
    }

    const loadChecklist = async () => {
      setFetching(true);
      setError(null);
      try {
        const checklist = await getChecklist();
        setItems(checklist);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load checklist.');
      } finally {
        setFetching(false);
      }
    };

    void loadChecklist();
  }, [user?.hasCompletedOnboarding]);

  const completedCount = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const nextItem = items.find((item) => !item.completed);

  const stats = useMemo(
    () => [
      { label: 'Plan progress', value: `${progress}%`, icon: Target, hint: `${completedCount}/${items.length} complete` },
      { label: 'Open routines', value: `${Math.max(items.length - completedCount, 0)}`, icon: Flame, hint: 'left to reinforce' },
      { label: 'Risk focus', value: '1', icon: ShieldCheck, hint: 'rule before entry' },
      { label: 'Review rhythm', value: 'Weekly', icon: BarChart3, hint: 'patterns need receipts' },
    ],
    [completedCount, items.length, progress],
  );

  const handleToggle = async (item: ChecklistItem, completed: boolean) => {
    setUpdatingId(item.id);
    setItems((current) =>
      current.map((candidate) => (candidate.id === item.id ? { ...candidate, completed } : candidate)),
    );

    try {
      const updated = await updateChecklistItem(item.id, completed);
      setItems((current) => current.map((candidate) => (candidate.id === updated.id ? updated : candidate)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update checklist item.');
      setItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id ? { ...candidate, completed: item.completed } : candidate,
        ),
      );
    } finally {
      setUpdatingId(null);
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
    <AppShell title="Dashboard">
      <GlassCard className="relative overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="hand text-2xl">today's plan</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">{greeting}</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Your AI-generated trading plan is {progress}% complete. Keep it boring enough to repeat.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="rounded-full" asChild>
                <a href="#plan">View checklist</a>
              </Button>
              <Button variant="outline" className="rounded-full bg-background/60" asChild>
                <a href="#review">Review rhythm</a>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-5">
            <div className="text-xs text-muted-foreground">Next process step</div>
            <div className="mt-1 font-display text-xl font-bold">
              {nextItem?.text ?? 'Everything is checked. Protect the habit.'}
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-display text-4xl font-bold">{progress}%</span>
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold">{stat.value}</div>
            <div className="hand mt-1 text-base text-muted-foreground">{stat.hint}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard id="plan" className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold">AI Trading Checklist</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Persisted from your onboarding stream</p>
            </div>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              saved
            </span>
          </div>

          {fetching ? (
            <div className="grid min-h-48 place-items-center rounded-2xl bg-secondary/60">
              <Loader2 className="h-7 w-7 animate-spin text-accent" />
            </div>
          ) : items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-xl bg-secondary/60 px-3 py-3 text-sm">
                  <Checkbox
                    className="mt-0.5"
                    checked={item.completed}
                    disabled={updatingId === item.id}
                    onCheckedChange={(checked) => void handleToggle(item, Boolean(checked))}
                  />
                  <span className={item.completed ? 'text-muted-foreground line-through' : ''}>{item.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl bg-secondary/60 p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-display text-xl font-bold">No checklist yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your plan was not found. Create a new account or reset this user to run onboarding again.
              </p>
            </div>
          )}

          {error && <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        </GlassCard>

        <GlassCard id="risk" className="p-6">
          <h3 className="font-display text-xl font-bold">Risk Guardrail</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Before each session, write the one condition that makes you stop trading today.
          </p>
          <div className="mt-6 rounded-2xl bg-foreground p-5 text-background">
            <div className="text-xs opacity-70">Default rule</div>
            <div className="mt-1 font-display text-2xl font-bold">Stop after max loss</div>
            <p className="mt-2 text-xs opacity-70">
              The plan can be adjusted later, but the first version protects capital and attention.
            </p>
          </div>
          <HandNote className="mt-4 block">boring rules beat heroic recoveries</HandNote>
        </GlassCard>
      </div>

      <GlassCard id="review" className="p-6">
        <h3 className="font-display text-xl font-bold">Review Rhythm</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            'Tag rule breaks immediately after the trade',
            'Review losing trades after the session, not during it',
            'Pick one behavior leak to fix each week',
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-secondary/60 p-4 text-sm">
              {item}
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}
