'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    title: 'whitespace-pre-wrap text-left',
                    success: '!bg-green-50 !text-green-600',
                    error: '!bg-red-50 !text-red-600',
                },
            }}
            icons={{
                success: <CheckCircle className="size-4 stroke-green-500" />,
                error: <AlertCircle className="size-4 stroke-red-500" />,
            }}
            {...props}
        />
    );
};

export { Toaster };
