import { Head, Link } from '@inertiajs/react';
import { BookOpenCheck, CircleDashed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import siswa from '@/routes/siswa';

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    selesai: boolean;
};

export default function SiswaModulIndex({ modul }: { modul: Modul[] }) {
    return (
        <>
            <Head title="Modul" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Modul Belajar</h1>
                    <p className="text-muted-foreground text-sm">
                        Baca setiap modul lalu kerjakan kuisnya.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {modul.map((item) => (
                        <Link key={item.id} href={siswa.modul.show(item.id)}>
                            <Card className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle>{item.nama_modul}</CardTitle>
                                        {item.selesai ? (
                                            <BookOpenCheck className="size-5 text-green-600" />
                                        ) : (
                                            <CircleDashed className="text-muted-foreground size-5" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Badge
                                        variant={
                                            item.selesai
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {item.selesai
                                            ? 'Sudah dikerjakan'
                                            : 'Belum dikerjakan'}
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

SiswaModulIndex.layout = {
    breadcrumbs: [{ title: 'Modul', href: siswa.modul.index() }],
};
