import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'FizzBuzz Arena',
    description: 'Challenge yourself and others in the FizzBuzz Arena!',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <main>
                    {children}
                    <Toaster />
                </main>
            </body>
        </html>
    );
}
