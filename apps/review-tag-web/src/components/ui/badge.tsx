import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase',
  {
    defaultVariants: {
      style: 'solid',
      tone: 'legacy',
    },
    variants: {
      style: {
        inactive: 'opacity-55',
        outlined: 'bg-transparent',
        solid: '',
      },
      tone: {
        family: '',
        frame: '',
        statusAmber: '',
        statusBlocked: '',
        statusGray: '',
        statusGreen1: '',
        statusGreen2: '',
        statusGreen3: '',
        statusGreen4: '',
        statusRed: '',
        implicit: '',
        legacy: '',
        marker: '',
        math: '',
        reasoning: '',
        status: '',
      },
    },
    compoundVariants: [
      {
        className:
          'border-[color:var(--tag-family-line)] bg-[color:var(--tag-family-fill)] text-[color:var(--tag-family-ink)]',
        style: 'solid',
        tone: 'family',
      },
      {
        className:
          'border-[color:var(--tag-family-line)] text-[color:var(--tag-family-ink)] border-dashed',
        style: 'outlined',
        tone: 'family',
      },
      {
        className:
          'border-[color:var(--tag-math-line)] bg-[color:var(--tag-math-fill)] text-[color:var(--tag-math-ink)]',
        style: 'solid',
        tone: 'math',
      },
      {
        className:
          'border-[color:var(--tag-math-line)] text-[color:var(--tag-math-ink)] border-dashed',
        style: 'outlined',
        tone: 'math',
      },
      {
        className:
          'border-[color:var(--tag-frame-line)] bg-[color:var(--tag-frame-fill)] text-[color:var(--tag-frame-ink)]',
        style: 'solid',
        tone: 'frame',
      },
      {
        className:
          'border-[color:var(--tag-frame-line)] text-[color:var(--tag-frame-ink)] border-dashed',
        style: 'outlined',
        tone: 'frame',
      },
      {
        className:
          'border-[color:var(--tag-marker-line)] bg-[color:var(--tag-marker-fill)] text-[color:var(--tag-marker-ink)]',
        style: 'solid',
        tone: 'marker',
      },
      {
        className:
          'border-[color:var(--tag-marker-line)] text-[color:var(--tag-marker-ink)] border-dashed',
        style: 'outlined',
        tone: 'marker',
      },
      {
        className:
          'border-[color:var(--tag-reasoning-line)] bg-[color:var(--tag-reasoning-fill)] text-[color:var(--tag-reasoning-ink)]',
        style: 'solid',
        tone: 'reasoning',
      },
      {
        className:
          'border-[color:var(--tag-reasoning-line)] text-[color:var(--tag-reasoning-ink)] border-dashed',
        style: 'outlined',
        tone: 'reasoning',
      },
      {
        className:
          'border-[color:var(--tag-legacy-line)] bg-[color:var(--tag-legacy-fill)] text-[color:var(--tag-legacy-ink)]',
        style: 'solid',
        tone: 'legacy',
      },
      {
        className:
          'border-[color:var(--tag-legacy-line)] text-[color:var(--tag-legacy-ink)] border-dashed',
        style: 'outlined',
        tone: 'legacy',
      },
      {
        className:
          'border-[color:var(--tag-implicit-line)] bg-[color:var(--tag-implicit-fill)] text-[color:var(--tag-implicit-ink)]',
        style: 'solid',
        tone: 'implicit',
      },
      {
        className:
          'border-[color:var(--tag-implicit-line)] text-[color:var(--tag-implicit-ink)] border-dashed',
        style: 'outlined',
        tone: 'implicit',
      },
      {
        className:
          'border-[color:var(--status-line)] bg-[color:var(--status-fill)] text-[color:var(--status-ink)]',
        style: 'solid',
        tone: 'status',
      },
      {
        className:
          'border-[color:var(--status-line)] text-[color:var(--status-ink)] border-dashed',
        style: 'outlined',
        tone: 'status',
      },
      {
        className:
          'border-[color:var(--status-gray-line)] bg-[color:var(--status-gray-fill)] text-[color:var(--status-gray-ink)]',
        style: 'solid',
        tone: 'statusGray',
      },
      {
        className:
          'border-[color:var(--status-gray-line)] text-[color:var(--status-gray-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusGray',
      },
      {
        className:
          'border-[color:var(--status-blocked-line)] bg-[color:var(--status-blocked-fill)] text-[color:var(--status-blocked-ink)]',
        style: 'solid',
        tone: 'statusBlocked',
      },
      {
        className:
          'border-[color:var(--status-blocked-line)] text-[color:var(--status-blocked-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusBlocked',
      },
      {
        className:
          'border-[color:var(--status-red-line)] bg-[color:var(--status-red-fill)] text-[color:var(--status-red-ink)]',
        style: 'solid',
        tone: 'statusRed',
      },
      {
        className:
          'border-[color:var(--status-red-line)] text-[color:var(--status-red-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusRed',
      },
      {
        className:
          'border-[color:var(--status-amber-line)] bg-[color:var(--status-amber-fill)] text-[color:var(--status-amber-ink)]',
        style: 'solid',
        tone: 'statusAmber',
      },
      {
        className:
          'border-[color:var(--status-amber-line)] text-[color:var(--status-amber-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusAmber',
      },
      {
        className:
          'border-[color:var(--status-green-1-line)] bg-[color:var(--status-green-1-fill)] text-[color:var(--status-green-1-ink)]',
        style: 'solid',
        tone: 'statusGreen1',
      },
      {
        className:
          'border-[color:var(--status-green-1-line)] text-[color:var(--status-green-1-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusGreen1',
      },
      {
        className:
          'border-[color:var(--status-green-2-line)] bg-[color:var(--status-green-2-fill)] text-[color:var(--status-green-2-ink)]',
        style: 'solid',
        tone: 'statusGreen2',
      },
      {
        className:
          'border-[color:var(--status-green-2-line)] text-[color:var(--status-green-2-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusGreen2',
      },
      {
        className:
          'border-[color:var(--status-green-3-line)] bg-[color:var(--status-green-3-fill)] text-[color:var(--status-green-3-ink)]',
        style: 'solid',
        tone: 'statusGreen3',
      },
      {
        className:
          'border-[color:var(--status-green-3-line)] text-[color:var(--status-green-3-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusGreen3',
      },
      {
        className:
          'border-[color:var(--status-green-4-line)] bg-[color:var(--status-green-4-fill)] text-[color:var(--status-green-4-ink)]',
        style: 'solid',
        tone: 'statusGreen4',
      },
      {
        className:
          'border-[color:var(--status-green-4-line)] text-[color:var(--status-green-4-ink)] border-dashed',
        style: 'outlined',
        tone: 'statusGreen4',
      },
    ],
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ children, className, style, tone }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ className, style, tone }))}>
      {children}
    </span>
  );
}
