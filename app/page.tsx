import Link from 'next/link';
import { ArrowRight, Check, ListChecks, ShieldCheck, Sparkles, Wand2, Zap } from 'lucide-react';
import { BrandLink } from '@/components/aiflow/BrandLink';
import { GlassCard } from '@/components/aiflow/GlassCard';
import { HandArrow, HandNote, ScribbleUnderline } from '@/components/aiflow/Scribble';
import { ThemeToggle } from '@/components/aiflow/ThemeToggle';
import { Button } from '@/components/ui/button';

const previewItems = [
  'Define one A+ setup before the session starts',
  'Set a daily max-loss rule and stop after it hits',
  'Journal every trade with trigger, risk, and emotion',
  'Review rule breaks every Friday before adding new ideas',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-4">
      <header className="mx-auto flex w-[min(1200px,94%)] items-center justify-between rounded-full border border-border/50 bg-background/40 px-4 py-3 backdrop-blur">
        <BrandLink />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#focus" className="hover:text-foreground">
            Focus
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="rounded-full">
            <Link href="/signup">Start</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto mt-16 w-[min(1100px,92%)] text-center md:mt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI onboarding for traders who need a cleaner next step
          </div>

          <h1 className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Turn trading chaos into a <ScribbleUnderline>repeatable plan</ScribbleUnderline>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Answer six trading questions. Axis streams a practical checklist for routines, risk,
            journaling, and behavior control.
          </p>

          <div className="relative mt-9 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
              <Link href="/signup">
                Build my plan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full bg-background/60 px-7 text-base">
              <a href="#how">See flow</a>
            </Button>
            <div className="absolute -right-8 -top-2 hidden w-28 rotate-12 md:block">
              <HandArrow className="h-auto w-full" />
              <HandNote className="-mt-2 ml-6 block">process over panic</HandNote>
            </div>
          </div>

          <div className="relative mt-16">
            <GlassCard strong className="animate-float-slow p-6 text-left md:p-8">
              <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    Streaming your trading plan...
                  </div>
                  <h3 className="mb-4 font-display text-2xl font-bold">
                    Your Plan: <span className="text-muted-foreground">Risk and routine reset</span>
                  </h3>
                  <ul className="space-y-2">
                    {previewItems.map((item) => (
                      <li key={item} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5 text-sm">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-background/80">
                          <Check className="h-3.5 w-3.5 text-accent" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <div className="text-xs text-muted-foreground">Plan progress</div>
                    <div className="mt-1 flex items-end justify-between">
                      <span className="font-display text-3xl font-bold">68%</span>
                      <span className="hand text-base">getting steady</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60">
                      <div className="h-full w-[68%] rounded-full bg-accent" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-foreground p-4 text-background">
                    <div className="text-xs opacity-70">Next up</div>
                    <div className="mt-1 font-medium">Write your stop-trading rule</div>
                    <div className="mt-1 text-xs opacity-70">Small rule. Large emotional savings.</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section id="how" className="mx-auto mt-28 grid w-[min(1100px,92%)] gap-5 md:grid-cols-3">
          {[
            { icon: Wand2, title: 'Answer trading questions', text: 'Goal, market, style, blocker, context, and notes.' },
            { icon: Zap, title: 'Watch the AI stream', text: 'Checklist items appear as Gemini creates the plan.' },
            { icon: ListChecks, title: 'Work the process', text: 'Check off routines and keep the plan visible.' },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-accent">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </GlassCard>
          ))}
        </section>

        <section id="focus" className="mx-auto my-28 w-[min(900px,92%)]">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold">No signals. No price targets. No magic candles.</h2>
                <p className="mt-2 text-muted-foreground">
                  Axis is about trader behavior: risk rules, review rhythm, discipline, and decision quality.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
