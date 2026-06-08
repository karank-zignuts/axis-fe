import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function BrandLink() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="font-display text-xl font-bold">Axis</span>
    </Link>
  );
}
