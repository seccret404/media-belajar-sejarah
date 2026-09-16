import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
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
    const jawabanRef = useRef(jawaban);
    const submittedRef = useRef(false);

    jawabanRef.current = jawaban;

    const submit = () => {
        if (submittedRef.current) {
            return;
        }

        submittedRef.current = true;

        router.post(
            siswa.kuis.store(modul.id).url,
            { jawaban: jawabanRef.current },
            {
                onError: () => {
                    submittedRef.current = false;
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
        <AppLayout
            breadcrumbs={[
                { title: 'Modul', href: siswa.modul.index() },
                { title: modul.nama_modul, href: siswa.modul.show(modul.id) },
                { title: 'Kuis', href: siswa.kuis.create(modul.id) },
            ]}
        >
            <Head title={`Kuis - ${modul.nama_modul}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        Kuis - {modul.nama_modul}
                    </h1>
                    <p className="text-destructive mt-1 text-sm">
                        Jangan berpindah tab atau membuka aplikasi lain selama
                        mengerjakan kuis. Kuis akan otomatis dikumpulkan jika
                        kamu meninggalkan halaman ini.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                    className="flex flex-col gap-4"
                >
                    {soal.map((item, index) => (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle className="text-base">
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
                                    required
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <Button type="submit" className="self-start">
                        Kumpulkan Kuis
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
