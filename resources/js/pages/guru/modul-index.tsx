import { Head, Link } from '@inertiajs/react';
import { BookText, ClipboardList } from 'lucide-react';
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
                    {modul.map((item, i) => (
                        <Link
                            key={item.id}
                            href={guru.modul.show(item.id)}
                            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <Card className="group hover:border-primary/50 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary group-hover:bg-primary/15 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors">
                                            <BookText className="size-5" />
                                        </div>
                                        <CardTitle>{item.nama_modul}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                                        <ClipboardList className="size-4" />
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
