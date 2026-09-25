import { Head } from '@inertiajs/react';
import {
    BarChart3,
    BookText,
    ClipboardList,
    History,
    Users,
} from 'lucide-react';
import { ScoreMeterList } from '@/components/dashboard/score-meter-list';
import { StatCard } from '@/components/dashboard/stat-card';
import { SkorBadge } from '@/components/skor-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initials } from '@/lib/utils';
import { dashboard } from '@/routes';

type SkorModul = {
    nama_modul: string;
    rata_rata: number | null;
    jumlah_siswa: number;
};

type Aktivitas = {
    nama: string;
    modul: string;
    skor: number | null;
    waktu: string;
};

export default function GuruDashboard({
    totalModul,
    totalSoal,
    totalSiswaAktif,
    rataRataSkor,
    skorPerModul,
    aktivitasTerbaru,
}: {
    totalModul: number;
    totalSoal: number;
    totalSiswaAktif: number;
    rataRataSkor: number;
    skorPerModul: SkorModul[];
    aktivitasTerbaru: Aktivitas[];
}) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">
                        Ringkasan kelola kuis dan progres belajar siswa.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={BookText}
                        label="Total modul"
                        value={totalModul}
                        delay={0}
                    />
                    <StatCard
                        icon={ClipboardList}
                        label="Total soal"
                        value={totalSoal}
                        accent="bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
                        delay={60}
                    />
                    <StatCard
                        icon={Users}
                        label="Siswa aktif"
                        value={totalSiswaAktif}
                        accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                        delay={120}
                    />
                    <StatCard
                        icon={BarChart3}
                        label="Rata-rata skor"
                        value={rataRataSkor}
                        accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                        delay={180}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <Card
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm lg:col-span-3"
                        style={{ animationDelay: '240ms' }}
                    >
                        <CardHeader>
                            <CardTitle className="text-base">
                                Rata-rata Skor per Modul
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScoreMeterList
                                items={skorPerModul.map((item) => ({
                                    label: item.nama_modul,
                                    value: item.rata_rata,
                                    caption:
                                        item.jumlah_siswa > 0
                                            ? `${item.jumlah_siswa} siswa`
                                            : undefined,
                                }))}
                            />
                        </CardContent>
                    </Card>

                    <Card
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards shadow-sm lg:col-span-2"
                        style={{ animationDelay: '300ms' }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <History className="text-muted-foreground size-4" />
                                Aktivitas Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {aktivitasTerbaru.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    Belum ada siswa yang mengerjakan kuis.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {aktivitasTerbaru.map((item, i) => (
                                        <div
                                            key={i}
                                            className="animate-in fade-in-0 fill-mode-backwards flex items-center gap-3"
                                            style={{
                                                animationDelay: `${360 + i * 50}ms`,
                                            }}
                                        >
                                            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                                {initials(item.nama)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {item.nama}
                                                </p>
                                                <p className="text-muted-foreground truncate text-xs">
                                                    {item.modul} · {item.waktu}
                                                </p>
                                            </div>
                                            <SkorBadge
                                                skor={item.skor}
                                                label={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

GuruDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
