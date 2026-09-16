import { Head, Link } from '@inertiajs/react';
import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import guru from '@/routes/guru';

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    kuis_count: number;
};

export default function GuruRiwayatIndex({ modul }: { modul: Modul[] }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Riwayat Kuis', href: guru.riwayat.index() },
            ]}
        >
            <Head title="Riwayat Kuis" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Riwayat Kuis</h1>
                    <p className="text-muted-foreground text-sm">
                        Pilih modul untuk melihat riwayat pengerjaan kuis siswa.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {modul.map((item) => (
                        <Link key={item.id} href={guru.riwayat.show(item.id)}>
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <History className="text-muted-foreground size-5" />
                                        <CardTitle>{item.nama_modul}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">
                                        {item.kuis_count} soal
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
