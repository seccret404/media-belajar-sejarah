import { Head, Link } from '@inertiajs/react';
import { BookText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import guru from '@/routes/guru';

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    kuis_count: number;
};

export default function GuruModulIndex({ modul }: { modul: Modul[] }) {
    return (
        <>
            <Head title="Kelola Kuis" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Kelola Kuis</h1>
                    <p className="text-muted-foreground text-sm">
                        Pilih modul untuk mengelola soal kuisnya.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {modul.map((item) => (
                        <Link key={item.id} href={guru.modul.show(item.id)}>
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BookText className="text-muted-foreground size-5" />
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
        </>
    );
}

GuruModulIndex.layout = {
    breadcrumbs: [{ title: 'Kelola Kuis', href: guru.modul.index() }],
};
