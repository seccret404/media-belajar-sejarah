import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import siswa from '@/routes/siswa';

type ReviewItem = {
    soal: string;
    jawaban: string;
    skor: number;
    review_ai: string | null;
};

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    konten: string | null;
};

export default function SiswaModulShow({
    modul,
    selesai,
    review,
}: {
    modul: Modul;
    selesai: boolean;
    review: ReviewItem[];
}) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Modul', href: siswa.modul.index() },
                { title: modul.nama_modul, href: siswa.modul.show(modul.id) },
            ]}
        >
            <Head title={modul.nama_modul} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {modul.nama_modul}
                    </h1>
                    {!selesai && (
                        <Button asChild>
                            <Link href={siswa.kuis.create(modul.id)}>
                                Ambil Kuis
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardContent className="prose dark:prose-invert max-w-none pt-6 whitespace-pre-wrap">
                        {modul.konten || 'Belum ada konten untuk modul ini.'}
                    </CardContent>
                </Card>

                {selesai && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Review Kuis</h2>
                        {review.map((item, index) => (
                            <Card key={index}>
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium">
                                        {index + 1}. {item.soal}
                                    </p>
                                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                                        Jawaban kamu:{' '}
                                        {item.jawaban || '(kosong)'}
                                    </p>
                                    <p className="mt-1 text-sm font-medium">
                                        Skor: {item.skor}
                                    </p>
                                    {item.review_ai && (
                                        <p className="text-muted-foreground mt-1 text-sm italic">
                                            Review AI: {item.review_ai}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
