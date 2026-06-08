'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLink } from '@/components/aiflow/BrandLink';
import { GlassCard } from '@/components/aiflow/GlassCard';
import { HandNote, ScribbleUnderline } from '@/components/aiflow/Scribble';
import { StreamingChecklist } from '@/components/aiflow/StreamingChecklist';
import { ThemeToggle } from '@/components/aiflow/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { streamChecklist } from '@/lib/api';
import { emptyTradingProfile, onboardingSteps } from '@/lib/trading-onboarding';
import { cn } from '@/lib/utils';
import type { TradingProfile } from '@/types';

const STREAM_REVEAL_DELAY_MS = 650;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<TradingProfile>(emptyTradingProfile);
  const [generating, setGenerating] = useState(false);
  const [streamedItems, setStreamedItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const current = onboardingSteps[step];
  const isLast = step === onboardingSteps.length - 1;
  const currentValue = profile[current.field] ?? '';
  const canContinue = currentValue.trim().length > 0 && !generating;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.hasCompletedOnboarding) {
      router.replace('/dashboard');
    }
  }, [loading, router, user]);

  const progressLabel = useMemo(() => `${step + 1} of ${onboardingSteps.length}`, [step]);

  const setAnswer = (value: string) => {
    setProfile((previous) => ({ ...previous, [current.field]: value }));
  };

  const goNext = async () => {
    if (!canContinue) {
      return;
    }

    if (!isLast) {
      setStep((value) => value + 1);
      return;
    }

    setGenerating(true);
    setError(null);
    setStreamedItems([]);

    try {
      let revealChain = Promise.resolve();

      const queueReveal = (text: string) => {
        revealChain = revealChain.then(async () => {
          setStreamedItems((items) => (items.includes(text) ? items : [...items, text]));
          await wait(STREAM_REVEAL_DELAY_MS);
        });
      };

      await streamChecklist(profile, {
        onItem: (item) => {
          queueReveal(item.text);
        },
        onError: (message) => {
          setError(message);
        },
      });

      await revealChain;
      await wait(450);

      const nextUser = await refreshUser();
      if (nextUser?.hasCompletedOnboarding) {
        router.replace('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checklist generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !user || user.hasCompletedOnboarding) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto mt-6 flex w-[min(1200px,94%)] items-center justify-between">
        <BrandLink />
        <ThemeToggle />
      </header>

      <main className="grid flex-1 place-items-center p-6">
        <GlassCard strong className="w-full max-w-2xl animate-fade-up p-6 md:p-8">
          {generating || streamedItems.length > 0 ? (
            <div className="py-8">
              <div className="text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent" />
                <h2 className="mt-6 font-display text-3xl font-bold">
                  Generating your <ScribbleUnderline>trading plan</ScribbleUnderline>
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Gemini is streaming practical process steps. No price targets, no market calls, just things you can repeat.
                </p>
              </div>

              <div className="mt-8">
                {streamedItems.length > 0 ? (
                  <StreamingChecklist
                    streaming={generating}
                    items={streamedItems.map((item) => ({
                      label: item,
                    }))}
                  />
                ) : (
                  <div className="rounded-2xl bg-secondary/60 p-5 text-center text-sm text-muted-foreground">
                    Waiting for the first checklist item...
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                  <Button className="mt-3 rounded-full" onClick={() => setGenerating(false)}>
                    Back to questions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {onboardingSteps.map((item, index) => (
                  <div
                    key={item.field}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      index <= step ? 'bg-accent' : 'bg-secondary',
                    )}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Step {progressLabel}</div>

              <div className="mt-6 flex items-start gap-4">
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent sm:grid">
                  {step === 0 ? <Sparkles className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold md:text-4xl">{current.label}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{current.description}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {current.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAnswer(chip)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-left text-sm transition-colors',
                      currentValue === chip
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-background/60 hover:border-foreground/30',
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {isLast && (
                <div className="mt-5">
                  <Textarea
                    value={profile.additionalContext}
                    onChange={(event) =>
                      setProfile((previous) => ({ ...previous, additionalContext: event.target.value }))
                    }
                    placeholder="Optional note: account size, time zone, risk rule, recent pattern, or anything the plan should respect."
                    className="bg-background/60"
                  />
                  <HandNote className="mt-2 block">extra context helps, autobiography optional</HandNote>
                </div>
              )}

              {error && <p className="mt-5 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                  disabled={step === 0}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={goNext} className="h-11 rounded-full px-6" disabled={!canContinue}>
                  {isLast ? 'Generate Trading Plan' : 'Next'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
