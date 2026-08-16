import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

export function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        'shrink-0 bg-[color:var(--line)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      decorative={decorative}
      orientation={orientation}
    />
  );
}
