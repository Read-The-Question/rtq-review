'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

export function CommandDialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(16,11,7,0.48)] backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed top-[12vh] left-1/2 z-50 w-[min(92vw,46rem)] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-[color:var(--line-strong)] bg-[color:var(--panel)] shadow-[0_24px_80px_rgba(42,25,10,0.28)]">
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b border-[color:var(--line)] px-4 py-3">
      <Search className="h-4 w-4 text-[color:var(--muted)]" />
      <CommandPrimitive.Input
        className={cn(
          'h-10 w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)]',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn('max-h-[28rem] overflow-y-auto p-2', className)}
      {...props}
    />
  );
}

export function CommandEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) {
  return (
    <CommandPrimitive.Empty
      className="px-4 py-8 text-center text-sm text-[color:var(--muted)]"
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  heading,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-[color:var(--foreground)]',
        className,
      )}
      heading={heading}
      {...props}
    />
  );
}

export function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'flex cursor-default items-center gap-2 rounded-2xl px-3 py-3 text-sm outline-none data-[selected=true]:bg-[color:var(--panel-soft)]',
        className,
      )}
      {...props}
    />
  );
}
