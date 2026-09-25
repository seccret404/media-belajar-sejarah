export function CompletionMeter({
    selesai,
    total,
}: {
    selesai: number;
    total: number;
}) {
    const persen = total > 0 ? Math.round((selesai / total) * 100) : 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Progres Belajar</span>
                <span className="text-muted-foreground text-sm">
                    {selesai} / {total} modul
                </span>
            </div>
            <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
                <div
                    className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${persen}%` }}
                />
            </div>
        </div>
    );
}
