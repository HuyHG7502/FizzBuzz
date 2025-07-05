'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn(
                    'h-full w-full flex-1 bg-gradient-to-r transition-all',
                    value && value >= 80
                        ? 'from-indigo-500 to-purple-700'
                        : value && value >= 60
                          ? 'from-blue-500 to-indigo-700'
                          : value && value >= 40
                            ? 'from-yellow-500 to-amber-600'
                            : value && value >= 20
                              ? 'from-orange-500 to-yellow-600'
                              : 'from-red-500 to-orange-600'
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
