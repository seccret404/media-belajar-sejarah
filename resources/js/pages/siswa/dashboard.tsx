import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3, BookOpenCheck, Sparkles } from 'lucide-react';
import { CompletionMeter } from '@/components/dashboard/completion-meter';
import { ScoreMeterList } from '@/components/dashboard/score-meter-list';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import siswa from '@/routes/siswa';

type SkorModul = {
    nama_modul: string;
    skor: number | null;
};

type ModulBerikutnya = {
    id: number;
    nama_modul: string;
} | null;

export default function SiswaDashboard({
    totalModul,
    modulSelesai,
    rataRataSkor,
    skorPerModul,
    modulBerikutnya,
}: {
    totalModul: number;
    modulSelesai: number;
    rataRataSkor: number;
    skorPerModul: SkorModul[];
    modulBerikutnya: ModulBerikutnya;
}) {
    const { auth } = usePage().props;
    const firstName = auth.user.name.split(' ')[0];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        Halo, {firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Ini progres belajar sejarahmu sejauh ini.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        icon={BookOpenCheck}
                        label="Modul selesai"
                        value={`${modulSelesai} / ${totalModul}`}
                        accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                        delay={0}
                    />
                    <StatCard
                        icon={BarChart3}
                        label="Skor rata-rata"
                        value={rataRataSkor}
                        accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                        delay={60}
                    />
                    <Card
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm"
                        style={{ animationDelay: '120ms' }}
                    >
                        <CardContent className="flex h-full flex-col justify-center gap-2 pt-6">
                            {modulBerikutnya ? (
                                <>
                                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                        <Sparkles className="size-3.5" />
                                        Lanjutkan belajar
                                    </p>
                                    <p className="truncate text-sm font-semibold">
                                        {modulBerikutnya.nama_modul}
                                    </p>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="mt-1 w-fit"
                                    >
                                        <Link
                                            href={siswa.modul.show(
                                                modulBerikutnya.id,
                                            )}
                                        >
                                            Buka modul <ArrowRight />
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm font-medium">
                                    🎉 Semua modul sudah kamu selesaikan!
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card
                    className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm"
                    style={{ animationDelay: '180ms' }}
                >
                    <CardHeader>
                        <CompletionMeter
                            selesai={modulSelesai}
                            total={totalModul}
                        />
                    </CardHeader>
                </Card>

                <Card
                    className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm"
                    style={{ animationDelay: '240ms' }}
                >
                    <CardHeader>
                        <CardTitle className="text-base">
                            Skor per Modul
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScoreMeterList
                            items={skorPerModul.map((item) => ({
                                label: item.nama_modul,
                                value: item.skor,
                            }))}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SiswaDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
