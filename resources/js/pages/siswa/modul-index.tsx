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
                    {modul.map((item, i) => (
                        <Link
                            key={item.id}
                            href={siswa.modul.show(item.id)}
                            className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <Card className="group hover:border-primary/50 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle>{item.nama_modul}</CardTitle>
                                        <div
                                            className={
                                                item.selesai
                                                    ? 'flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400'
                                                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex size-9 shrink-0 items-center justify-center rounded-full transition-colors'
                                            }
                                        >
                                            {item.selesai ? (
                                                <BookOpenCheck className="size-5" />
                                            ) : (
                                                <CircleDashed className="size-5" />
                                            )}
                                        </div>
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
