import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type ScoreMeterItem = {
    label: string;
    value: number | null;
    caption?: string;
};

function barColor(value: number): string {
    if (value >= 80) {
        return 'var(--chart-good)';
    }

    if (value >= 60) {
        return 'var(--chart-warning)';
    }

    return 'var(--chart-critical)';
}

export function ScoreMeterList({ items }: { items: ScoreMeterItem[] }) {
    return (
        <div className="flex flex-col gap-2.5">
            {items.map((item, i) => (
                <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                        <div
                            tabIndex={0}
                            className="group animate-in fade-in-0 slide-in-from-left-1 fill-mode-backwards focus-visible:bg-muted grid grid-cols-[minmax(0,8rem)_1fr_2.5rem] items-center gap-3 rounded-md px-1 py-1 outline-none sm:grid-cols-[minmax(0,11rem)_1fr_2.5rem]"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <span className="text-muted-foreground truncate text-sm">
                                {item.label}
                            </span>
                            <span className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                                {item.value !== null && (
                                    <span
                                        className="block h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                                        style={{
                                            width: `${item.value}%`,
                                            backgroundColor: barColor(
                                                item.value,
                                            ),
                                        }}
                                    />
                                )}
                            </span>
                            <span className="text-right text-sm font-medium tabular-nums">
                                {item.value !== null ? item.value : '—'}
                            </span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {item.label}:{' '}
                        {item.value !== null
                            ? `Skor ${item.value}`
                            : 'Belum dikerjakan'}
                        {item.caption ? ` · ${item.caption}` : ''}
                    </TooltipContent>
                </Tooltip>
            ))}

            <table className="sr-only">
                <caption>Skor per modul</caption>
                <thead>
                    <tr>
                        <th>Modul</th>
                        <th>Skor</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.label}>
                            <td>{item.label}</td>
                            <td>
                                {item.value !== null
                                    ? item.value
                                    : 'Belum dikerjakan'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
