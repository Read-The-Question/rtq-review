'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4',
        icon: 'h-9 w-9',
        lg: 'h-11 px-5',
        sm: 'h-8 px-3 text-xs',
      },
      variant: {
        default:
          'bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)]',
        ghost:
          'bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--panel-soft)]',
        outline:
          'border border-[color:var(--line-strong)] bg-white text-[color:var(--foreground)] hover:bg-[color:var(--panel-soft)]',
        subtle:
          'bg-[color:var(--panel-soft)] text-[color:var(--foreground)] hover:bg-[color:var(--panel-softer)]',
      },
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
