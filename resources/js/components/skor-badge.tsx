import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, scoreBadgeClass } from '@/lib/utils';

export function SkorBadge({
    skor,
    maks = 100,
    label = true,
    className,
}: {
    skor: number | null;
    maks?: number;
    label?: boolean;
    className?: string;
}) {
    if (skor === null) {
        return (
            <Badge
                className={cn(
                    'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
                    className,
                )}
            >
                <Clock />
                Perlu Ditinjau
            </Badge>
        );
    }

    return (
        <Badge className={cn(scoreBadgeClass(skor, maks), className)}>
            {label
                ? `Skor ${skor}${maks !== 100 ? `/${maks}` : ''}`
                : skor}
        </Badge>
    );
}
