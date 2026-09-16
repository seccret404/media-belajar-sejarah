import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import guru from '@/routes/guru';

type Kuis = {
    id: number;
    soal: string;
    jawaban_ekspektasi: string;
    key_jawaban: string;
    history_user_count: number;
};

type Modul = {
    id: number;
    nama_modul: string;
    urutan: number;
    kuis: Kuis[];
};

type FormRow = {
    id?: number;
    soal: string;
    jawaban_ekspektasi: string;
    key_jawaban: string;
    history_user_count: number;
};

export default function GuruModulShow({ modul }: { modul: Modul }) {
    const { data, setData, put, processing, errors } = useForm<{
        soal: FormRow[];
    }>({
        soal: modul.kuis,
    });

    const emptyRow = (): FormRow => ({
        soal: '',
        jawaban_ekspektasi: '',
        key_jawaban: '',
        history_user_count: 0,
    });

    const addRow = () => setData('soal', [...data.soal, emptyRow()]);

    const removeRow = (index: number) =>
        setData(
            'soal',
            data.soal.filter((_, i) => i !== index),
        );

    const updateRow = (
        index: number,
        field: keyof Omit<FormRow, 'id' | 'history_user_count'>,
        value: string,
    ) =>
        setData(
            'soal',
            data.soal.map((row, i) =>
                i === index ? { ...row, [field]: value } : row,
            ),
        );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(guru.modul.update(modul.id).url);
    };

    return (
        <>
            <Head title={`Kelola Kuis - ${modul.nama_modul}`} />
            <form onSubmit={submit} className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {modul.nama_modul}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola soal essay untuk modul ini. Siswa akan
                            mengerjakan 5 soal yang dipilih acak dari daftar
                            ini.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="shadow-sm"
                    >
                        Simpan Kuis
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {data.soal.map((row, index) => (
                        <Card
                            key={row.id ?? `new-${index}`}
                            className="animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards border-l-primary/40 border-l-4"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                        {index + 1}
                                    </span>
                                    Soal {index + 1}
                                    {row.history_user_count > 0 && (
                                        <span className="text-muted-foreground ml-1 text-xs font-normal">
                                            (sudah dikerjakan{' '}
                                            {row.history_user_count} siswa)
                                        </span>
                                    )}
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={row.history_user_count > 0}
                                    onClick={() => removeRow(index)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Soal</Label>
                                    <Textarea
                                        value={row.soal}
                                        onChange={(e) =>
                                            updateRow(
                                                index,
                                                'soal',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors[`soal.${index}.soal`] && (
                                        <p className="text-destructive text-sm">
                                            {errors[`soal.${index}.soal`]}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label>Jawaban Guru (Ekspektasi)</Label>
                                    <Textarea
                                        value={row.jawaban_ekspektasi}
                                        onChange={(e) =>
                                            updateRow(
                                                index,
                                                'jawaban_ekspektasi',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Key Jawaban</Label>
                                    <Textarea
                                        value={row.key_jawaban}
                                        onChange={(e) =>
                                            updateRow(
                                                index,
                                                'key_jawaban',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Poin-poin unsur yang diharapkan ada di jawaban siswa, satu poin per baris"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button type="button" variant="outline" onClick={addRow}>
                    <Plus /> Tambah Soal
                </Button>
            </form>
        </>
    );
}

GuruModulShow.layout = (page: { modul: Modul }) => ({
    breadcrumbs: [
        { title: 'Kelola Kuis', href: guru.modul.index() },
        { title: page.modul.nama_modul, href: guru.modul.show(page.modul.id) },
    ],
});
