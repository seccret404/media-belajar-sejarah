import { Head, Link } from '@inertiajs/react';
import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { scoreBadgeClass } from '@/lib/utils';
import siswa from '@/routes/siswa';

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    jumlah_soal: number;
    skor: number;
};

export default function SiswaRiwayatIndex({ modul }: { modul: Modul[] }) {
    return (
        <>
            <Head title="Riwayat Kuis" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Riwayat Kuis</h1>
                    <p className="text-muted-foreground text-sm">
                        Daftar modul yang sudah kamu kerjakan kuisnya.
                    </p>
                </div>

                {modul.length === 0 && (
                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
                        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                            <History className="size-6" />
                        </div>
                        <p className="text-sm">
                            Kamu belum mengerjakan kuis apapun.
                        </p>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {modul.map((item, i) => (
                        <Link
                            key={item.id}
                            href={siswa.riwayat.show(item.id)}
                            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <Card className="hover:border-primary/50 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>{item.nama_modul}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <p className="text-muted-foreground text-sm">
                                        {item.jumlah_soal} soal dikerjakan
                                    </p>
                                    <Badge
                                        className={scoreBadgeClass(item.skor)}
                                    >
                                        Skor {item.skor}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

SiswaRiwayatIndex.layout = {
    breadcrumbs: [{ title: 'Riwayat', href: siswa.riwayat.index() }],
};
