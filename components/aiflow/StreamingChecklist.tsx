'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';

type Item = {
  id?: string;
  label: string;
  status?: 'done' | 'streaming' | 'queued';
};

export function StreamingChecklist({ items, streaming = false }: { items: Item[]; streaming?: boolean }) {
  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const status = item.status ?? (streaming && index === items.length - 1 ? 'streaming' : 'done');
          return (
            <motion.li
              key={item.id ?? `${item.label}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5 text-sm"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-background/80">
                {status === 'done' && <Check className="h-3.5 w-3.5 text-accent" />}
                {status === 'streaming' && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
                {status === 'queued' && <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
              </span>
              <span>{item.label}</span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
