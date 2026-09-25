import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
    icon: Icon,
    label,
    value,
    accent,
    delay = 0,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    accent?: string;
    delay?: number;
}) {
    return (
        <Card
            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm"
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardContent className="flex items-center gap-4 pt-6">
                <div
                    className={cn(
                        'flex size-11 shrink-0 items-center justify-center rounded-xl',
                        accent ?? 'bg-primary/10 text-primary',
                    )}
                >
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-muted-foreground truncate text-sm">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
