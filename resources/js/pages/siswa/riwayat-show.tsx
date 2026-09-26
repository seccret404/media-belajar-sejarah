import { Head } from '@inertiajs/react';
import { AiReviewNote } from '@/components/ai-review-note';
import { SkorBadge } from '@/components/skor-badge';
import { Card, CardContent } from '@/components/ui/card';
import siswa from '@/routes/siswa';

type ReviewItem = {
    soal: string;
    jawaban: string;
    skor: number | null;
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
        <>
            <Head title={`Riwayat - ${modul.nama_modul}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">
                    Riwayat Kuis - {modul.nama_modul}
                </h1>

                <div className="flex flex-col gap-4">
                    {review.map((item, index) => (
                        <Card
                            key={index}
                            className="animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <CardContent className="pt-6">
                                <p className="text-sm font-medium">
                                    {index + 1}. {item.soal}
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                                    Jawaban kamu: {item.jawaban || '(kosong)'}
                                </p>
                                <SkorBadge
                                    skor={item.skor}
                                    maks={20}
                                    className="mt-2"
                                />
                                {item.review_ai && (
                                    <AiReviewNote text={item.review_ai} />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

SiswaRiwayatShow.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Riwayat', href: siswa.riwayat.index() },
        {
            title: page.modul.nama_modul,
            href: siswa.riwayat.show(page.modul.id),
        },
    ],
});
