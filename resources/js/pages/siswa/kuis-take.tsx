import { Head, router } from '@inertiajs/react';
import { Bot, ShieldAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import siswa from '@/routes/siswa';

type Soal = {
    id: number;
    soal: string;
};

type Modul = {
    id: number;
    nama_modul: string;
};

export default function SiswaKuisTake({
    modul,
    soal,
}: {
    modul: Modul;
    soal: Soal[];
}) {
    const [jawaban, setJawaban] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const jawabanRef = useRef(jawaban);
    const submittedRef = useRef(false);
    const terjawab = soal.filter((item) =>
        (jawaban[item.id] ?? '').trim(),
    ).length;

    jawabanRef.current = jawaban;

    const submit = () => {
        if (submittedRef.current) {
            return;
        }

        submittedRef.current = true;
        setSubmitting(true);

        router.post(
            siswa.kuis.store(modul.id).url,
            { jawaban: jawabanRef.current },
            {
                onError: () => {
                    submittedRef.current = false;
                    setSubmitting(false);
                },
            },
        );
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                submit();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () =>
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head title={`Kuis - ${modul.nama_modul}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-xl font-semibold">
                        Kuis - {modul.nama_modul}
                    </h1>
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        {terjawab} / {soal.length} terjawab
                    </span>
                </div>

                <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-lg border p-3">
                    <ShieldAlert className="text-destructive mt-0.5 size-5 shrink-0" />
                    <p className="text-destructive text-sm">
                        Jangan berpindah tab atau membuka aplikasi lain selama
                        mengerjakan kuis. Kuis akan otomatis dikumpulkan jika
                        kamu meninggalkan halaman ini.
                    </p>
                </div>

                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${(terjawab / soal.length) * 100}%`,
                        }}
                    />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    className="flex flex-col gap-4"
                >
                    {soal.map((item, index) => (
                        <Card
                            key={item.id}
                            className="animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards shadow-sm"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                        {index + 1}
                                    </span>
                                    Soal {index + 1}
                                </CardTitle>
                                <p className="text-sm">{item.soal}</p>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={jawaban[item.id] ?? ''}
                                    onChange={(e) =>
                                        setJawaban((prev) => ({
                                            ...prev,
                                            [item.id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Tulis jawabanmu di sini"
                                    className="min-h-32"
                                    disabled={submitting}
                                    required
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        type="submit"
                        className="self-start shadow-sm"
                        disabled={submitting}
                    >
                        Kumpulkan Kuis
                    </Button>
                </form>
            </div>

            {submitting && (
                <div className="bg-background/80 animate-in fade-in-0 fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm duration-300">
                    <div className="relative flex size-16 items-center justify-center">
                        <span className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
                        <div className="bg-primary text-primary-foreground relative flex size-16 items-center justify-center rounded-full shadow-lg">
                            <Bot className="size-8" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold">
                            Sedang menilai jawabanmu...
                        </p>
                        <p className="text-muted-foreground mt-1 max-w-xs text-sm">
                            AI sedang membaca dan memberi skor tiap jawaban.
                            Mohon tunggu sebentar, jangan tutup halaman ini.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

SiswaKuisTake.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Modul', href: siswa.modul.index() },
        { title: page.modul.nama_modul, href: siswa.modul.show(page.modul.id) },
        { title: 'Kuis', href: siswa.kuis.create(page.modul.id) },
    ],
});
