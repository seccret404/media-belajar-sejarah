import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function initials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export function scoreBadgeClass(skor: number, maks: number = 100): string {
    const persen = (skor / maks) * 100;

    if (persen >= 80) {
        return 'border-transparent bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
    }
    if (persen >= 60) {
        return 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
    }
    return 'border-transparent bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
}
