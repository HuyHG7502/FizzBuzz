import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    Crown,
    Flag,
    Heart,
    LucideIcon,
    Star,
    Target,
    Trophy,
    Zap,
} from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getGameColour(gameId: string): string {
    const colours = [
        'from-orange-500 to-red-600',
        'from-yellow-500 to-orange-600',
        'from-green-500 to-teal-600',
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-600',
        'from-rose-500 to-red-600',
    ];

    const idx = gameId.charCodeAt(0) % colours.length;
    return colours[idx];
}

export function getGameIcon(gameId: string): LucideIcon {
    const icons = [Target, Star, Crown, Trophy, Zap, Heart, Flag];

    const idx = gameId.charCodeAt(gameId.length - 1) % icons.length;
    return icons[idx];
}

export function sortRules<T extends { rules: { divisor: number }[] }>(
    game: T
): T {
    return {
        ...game,
        rules: [...game.rules].sort((a, b) => a.divisor - b.divisor),
    };
}

export function formatDate(dateString: string): string {
    return new Date(
        dateString.replace(/\.(\d{3})\d*Z$/, '.$1Z')
    ).toLocaleDateString();
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
