'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { BrandLink } from '@/components/aiflow/BrandLink';
import { GlassCard } from '@/components/aiflow/GlassCard';
import { HandNote } from '@/components/aiflow/Scribble';
import { ThemeToggle } from '@/components/aiflow/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.hasCompletedOnboarding ? '/dashboard' : '/onboarding');
    }
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const nextUser = await login({ email, password });
      router.replace(nextUser.hasCompletedOnboarding ? '/dashboard' : '/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto mt-6 flex w-[min(1200px,94%)] items-center justify-between">
        <BrandLink />
        <ThemeToggle />
      </header>

      <main className="grid flex-1 place-items-center p-6">
        <GlassCard strong className="w-full max-w-md animate-fade-up p-8">
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your trading routine has been patiently judging the empty checklist.
          </p>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            email login
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@tradingdesk.com"
                className="bg-background/60"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="bg-background/60"
                required
              />
            </div>
            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="h-11 w-full rounded-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Login
            </Button>
          </form>

          <HandNote className="mt-3 block text-center">show up before the market does</HandNote>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/signup" className="font-medium text-foreground hover:underline">
              Create account
            </Link>
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
