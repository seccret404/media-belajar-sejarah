import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import siswa from '@/routes/siswa';

type ReviewItem = {
    soal: string;
    jawaban: string;
    skor: number;
    review_ai: string | null;
};

type Section = {
    judul: string;
    konten: string;
};

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    tujuan_pembelajaran: string[];
    pertanyaan_pemantik: string | null;
    sections: Section[];
};

type Slide =
    | {
          type: 'intro';
          tujuan_pembelajaran: string[];
          pertanyaan_pemantik: string | null;
      }
    | { type: 'section'; judul: string; konten: string };

export default function SiswaModulShow({
    modul,
    selesai,
    review,
}: {
    modul: Modul;
    selesai: boolean;
    review: ReviewItem[];
}) {
    const slides: Slide[] = [
        {
            type: 'intro',
            tujuan_pembelajaran: modul.tujuan_pembelajaran,
            pertanyaan_pemantik: modul.pertanyaan_pemantik,
        },
        ...modul.sections.map((section): Slide => ({
            type: 'section',
            ...section,
        })),
    ];

    const [index, setIndex] = useState(0);
    const slide = slides[index];
    const isFirst = index === 0;
    const isLast = index === slides.length - 1;

    return (
        <>
            <Head title={modul.nama_modul} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">{modul.nama_modul}</h1>

                <Card className="flex min-h-100 flex-col">
                    <CardContent className="flex flex-1 flex-col pt-6">
                        <div className="flex-1">
                            {slide.type === 'intro' ? (
                                <div className="flex flex-col gap-4">
                                    {slide.tujuan_pembelajaran.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Tujuan Pembelajaran
                                            </p>
                                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                                                {slide.tujuan_pembelajaran.map(
                                                    (tujuan, i) => (
                                                        <li key={i}>
                                                            {tujuan}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                    {slide.pertanyaan_pemantik && (
                                        <div className="border-primary/30 bg-primary/5 flex gap-3 rounded-lg border p-4">
                                            <Lightbulb className="text-primary size-5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    Pertanyaan Pemantik
                                                </p>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                    {slide.pertanyaan_pemantik}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold">
                                        {slide.judul}
                                    </h2>
                                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                        {slide.konten}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isFirst}
                                onClick={() => setIndex((i) => i - 1)}
                            >
                                <ChevronLeft /> Sebelumnya
                            </Button>

                            <p className="text-muted-foreground text-sm">
                                {index + 1} / {slides.length}
                            </p>

                            {isLast ? (
                                !selesai && (
                                    <Button asChild>
                                        <Link
                                            href={siswa.kuis.create(modul.id)}
                                        >
                                            Ambil Kuis
                                        </Link>
                                    </Button>
                                )
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIndex((i) => i + 1)}
                                >
                                    Selanjutnya <ChevronRight />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {selesai && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Review Kuis</h2>
                        {review.map((item, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium">
                                        {i + 1}. {item.soal}
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
        </>
    );
}

SiswaModulShow.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Modul', href: siswa.modul.index() },
        { title: page.modul.nama_modul, href: siswa.modul.show(page.modul.id) },
    ],
});
