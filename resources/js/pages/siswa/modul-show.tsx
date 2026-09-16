import { Head, Link } from '@inertiajs/react';
import { Lightbulb } from 'lucide-react';
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
        <>
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

                {modul.tujuan_pembelajaran.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm font-semibold">
                                Tujuan Pembelajaran
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                                {modul.tujuan_pembelajaran.map((tujuan, i) => (
                                    <li key={i}>{tujuan}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {modul.pertanyaan_pemantik && (
                    <Card className="border-primary/30 bg-primary/5">
                        <CardContent className="flex gap-3 pt-6">
                            <Lightbulb className="text-primary size-5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Pertanyaan Pemantik
                                </p>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {modul.pertanyaan_pemantik}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {modul.sections.length === 0 && (
                    <Card>
                        <CardContent className="text-muted-foreground pt-6 text-sm">
                            Belum ada konten untuk modul ini.
                        </CardContent>
                    </Card>
                )}

                {modul.sections.map((section, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <h2 className="mb-2 font-semibold">
                                {section.judul}
                            </h2>
                            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                {section.konten}
                            </p>
                        </CardContent>
                    </Card>
                ))}

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
        </>
    );
}

SiswaModulShow.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Modul', href: siswa.modul.index() },
        { title: page.modul.nama_modul, href: siswa.modul.show(page.modul.id) },
    ],
});
