import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
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
        <AppLayout
            breadcrumbs={[{ title: 'Riwayat', href: siswa.riwayat.index() }]}
        >
            <Head title="Riwayat Kuis" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Riwayat Kuis</h1>
                    <p className="text-muted-foreground text-sm">
                        Daftar modul yang sudah kamu kerjakan kuisnya.
                    </p>
                </div>

                {modul.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        Kamu belum mengerjakan kuis apapun.
                    </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {modul.map((item) => (
                        <Link key={item.id} href={siswa.riwayat.show(item.id)}>
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle>{item.nama_modul}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        {item.jumlah_soal} soal dikerjakan
                                    </p>
                                    <p className="text-sm font-medium">
                                        Skor: {item.skor}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
