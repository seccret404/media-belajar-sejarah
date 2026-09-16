import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    FileText,
    Lightbulb,
    Target,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { scoreBadgeClass } from '@/lib/utils';
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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const slide = slides[index];
    const isFirst = index === 0;
    const isLast = index === slides.length - 1;

    return (
        <>
            <Head title={modul.nama_modul} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">{modul.nama_modul}</h1>

                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${((index + 1) / slides.length) * 100}%`,
                        }}
                    />
                </div>

                <Card className="flex min-h-100 flex-col shadow-sm">
                    <CardContent className="flex flex-1 flex-col pt-6">
                        <div
                            key={index}
                            className="animate-in fade-in-0 slide-in-from-right-2 flex-1 duration-300"
                        >
                            {slide.type === 'intro' ? (
                                <div className="flex flex-col gap-4">
                                    {slide.tujuan_pembelajaran.length > 0 && (
                                        <div>
                                            <p className="flex items-center gap-2 text-sm font-semibold">
                                                <Target className="text-primary size-4" />
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
                                            <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                                                <Lightbulb className="size-5" />
                                            </div>
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
                                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                        <FileText className="text-primary size-5" />
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
                                    <Button
                                        type="button"
                                        onClick={() => setConfirmOpen(true)}
                                    >
                                        Ambil Kuis
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
                            <Card
                                key={i}
                                className="animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <CardContent className="pt-6">
                                    <p className="text-sm font-medium">
                                        {i + 1}. {item.soal}
                                    </p>
                                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                                        Jawaban kamu:{' '}
                                        {item.jawaban || '(kosong)'}
                                    </p>
                                    <Badge
                                        className={`mt-2 ${scoreBadgeClass(item.skor)}`}
                                    >
                                        Skor {item.skor}
                                    </Badge>
                                    {item.review_ai && (
                                        <p className="text-muted-foreground mt-2 text-sm italic">
                                            Review AI: {item.review_ai}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle>Mulai kerjakan kuis?</DialogTitle>
                        <DialogDescription>
                            Setelah kuis dimulai, kamu tidak bisa kembali ke
                            halaman modul sebelum mengumpulkan jawaban.
                            Berpindah tab atau keluar dari halaman kuis akan
                            membuat kuis otomatis terkumpul dengan jawaban yang
                            sudah kamu isi sejauh itu.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button asChild>
                            <Link href={siswa.kuis.create(modul.id)}>
                                Ya, Mulai Kuis
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

SiswaModulShow.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Modul', href: siswa.modul.index() },
        { title: page.modul.nama_modul, href: siswa.modul.show(page.modul.id) },
    ],
});
