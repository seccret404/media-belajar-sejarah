import { Head } from '@inertiajs/react';
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
};

export default function SiswaRiwayatShow({
    modul,
    review,
}: {
    modul: Modul;
    review: ReviewItem[];
}) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Riwayat', href: siswa.riwayat.index() },
                {
                    title: modul.nama_modul,
                    href: siswa.riwayat.show(modul.id),
                },
            ]}
        >
            <Head title={`Riwayat - ${modul.nama_modul}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">
                    Riwayat Kuis - {modul.nama_modul}
                </h1>

                <div className="flex flex-col gap-4">
                    {review.map((item, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium">
                                    {index + 1}. {item.soal}
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                                    Jawaban kamu: {item.jawaban || '(kosong)'}
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
            </div>
        </AppLayout>
    );
}
