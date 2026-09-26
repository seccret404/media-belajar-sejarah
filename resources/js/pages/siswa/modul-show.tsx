import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BookMarked,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Lightbulb,
    type LucideIcon,
    Sparkles,
    Target,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AiReviewNote } from '@/components/ai-review-note';
import { SkorBadge } from '@/components/skor-badge';
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
import {
    type CalloutTone,
    type ContentBlock,
    parseArrowLine,
    parseSectionContent,
    splitVisualLines,
} from '@/lib/modul-content';
import { cn } from '@/lib/utils';
import siswa from '@/routes/siswa';

type ReviewItem = {
    soal: string;
    jawaban: string;
    skor: number | null;
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

const SECTION_ACCENTS = [
    'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
];

const CALLOUT_STYLES: Record<
    CalloutTone,
    { icon: LucideIcon; box: string; iconBox: string }
> = {
    tip: {
        icon: BookMarked,
        box: 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10',
        iconBox:
            'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    fact: {
        icon: Sparkles,
        box: 'border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10',
        iconBox:
            'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    },
    example: {
        icon: Eye,
        box: 'border-teal-200 bg-teal-50 dark:border-teal-500/30 dark:bg-teal-500/10',
        iconBox:
            'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
    },
};

function TextLines({ text, className }: { text: string; className?: string }) {
    const lines = splitVisualLines(text);

    return (
        <div className={cn('space-y-1.5', className)}>
            {lines.map((line, i) => {
                const arrow = parseArrowLine(line);

                if (arrow) {
                    return (
                        <div
                            key={i}
                            className="flex flex-wrap items-baseline gap-x-1.5"
                        >
                            <span className="text-foreground font-semibold">
                                {arrow.term}
                            </span>
                            <ArrowRight className="text-muted-foreground size-3.5 shrink-0 self-center" />
                            <span>{arrow.text}</span>
                        </div>
                    );
                }

                return <p key={i}>{line}</p>;
            })}
        </div>
    );
}

function SectionBlock({ block }: { block: ContentBlock }) {
    if (block.type === 'callout') {
        const style = CALLOUT_STYLES[block.tone];
        const Icon = style.icon;

        return (
            <div className={cn('flex gap-3 rounded-lg border p-4', style.box)}>
                <div
                    className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full',
                        style.iconBox,
                    )}
                >
                    <Icon className="size-5" />
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold">{block.title}</p>
                    <div className="space-y-2 text-sm">
                        {block.lines.map((line, i) => (
                            <TextLines key={i} text={line} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (block.type === 'timeline') {
        return (
            <div className="relative flex flex-col gap-5 py-1">
                <span className="bg-border absolute top-4 bottom-4 left-4 w-px" />
                {block.items.map((item, i) => (
                    <div key={i} className="relative flex items-center gap-3">
                        <span className="bg-primary text-primary-foreground relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                            {item.year}
                        </span>
                        <p className="text-muted-foreground text-sm">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    if (block.type === 'list') {
        return (
            <div>
                {block.heading && (
                    <p className="mb-2 text-sm font-semibold">
                        {block.heading}
                    </p>
                )}
                <ul className="space-y-1.5 text-sm">
                    {block.items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                            <span className="text-muted-foreground">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div>
            {block.label && (
                <p className="text-sm font-semibold">{block.label}</p>
            )}
            <TextLines
                text={block.text}
                className="text-muted-foreground text-sm"
            />
        </div>
    );
}

function SectionSlideContent({ konten }: { konten: string }) {
    const blocks = useMemo(() => parseSectionContent(konten), [konten]);

    return (
        <div className="flex flex-col gap-4">
            {blocks.map((block, i) => (
                <SectionBlock key={i} block={block} />
            ))}
        </div>
    );
}

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
    const sectionIndex = index - 1;
    const accent = SECTION_ACCENTS[sectionIndex % SECTION_ACCENTS.length];

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
                                <div className="relative">
                                    <span className="text-foreground/5 pointer-events-none absolute -top-4 right-0 hidden text-8xl font-black select-none sm:block">
                                        {String(sectionIndex + 1).padStart(
                                            2,
                                            '0',
                                        )}
                                    </span>
                                    <h2 className="relative mb-4 flex items-center gap-2 text-lg font-semibold sm:pr-20">
                                        <span
                                            className={cn(
                                                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                                                accent,
                                            )}
                                        >
                                            <FileText className="size-5" />
                                        </span>
                                        {slide.judul}
                                    </h2>
                                    <div className="relative">
                                        <SectionSlideContent
                                            konten={slide.konten}
                                        />
                                    </div>
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
