import { Head, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import guru from '@/routes/guru';

type DetailItem = {
    soal: string;
    jawaban: string;
    skor: number;
    review_ai: string | null;
};

type Siswa = {
    id: number;
    nama: string;
    angkatan: number | null;
    jumlah_soal: number;
    skor: number;
    detail: DetailItem[];
};

type Modul = {
    id: number;
    nama_modul: string;
};

export default function GuruRiwayatShow({
    modul,
    siswa,
    filters,
}: {
    modul: Modul;
    siswa: Siswa[];
    filters: { search: string; angkatan: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const [angkatan, setAngkatan] = useState(filters.angkatan);
    const [detail, setDetail] = useState<Siswa | null>(null);

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            guru.riwayat.show(modul.id).url,
            { search, angkatan },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Riwayat Kuis', href: guru.riwayat.index() },
                {
                    title: modul.nama_modul,
                    href: guru.riwayat.show(modul.id),
                },
            ]}
        >
            <Head title={`Riwayat Kuis - ${modul.nama_modul}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-xl font-semibold">
                    Riwayat Kuis - {modul.nama_modul}
                </h1>

                <form
                    onSubmit={applyFilters}
                    className="flex flex-wrap items-end gap-2"
                >
                    <div className="grid gap-1">
                        <label className="text-sm font-medium">Cari nama</label>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama siswa"
                            className="w-48"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-sm font-medium">Angkatan</label>
                        <Input
                            value={angkatan}
                            onChange={(e) => setAngkatan(e.target.value)}
                            placeholder="2026"
                            className="w-32"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Cari
                    </Button>
                </form>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Angkatan</TableHead>
                                <TableHead>Soal Dikerjakan</TableHead>
                                <TableHead>Skor</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {siswa.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-muted-foreground text-center"
                                    >
                                        Belum ada siswa yang mengerjakan kuis
                                        ini.
                                    </TableCell>
                                </TableRow>
                            )}
                            {siswa.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>{item.angkatan}</TableCell>
                                    <TableCell>{item.jumlah_soal}</TableCell>
                                    <TableCell>{item.skor}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDetail(item)}
                                        >
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog
                open={detail !== null}
                onOpenChange={(open) => !open && setDetail(null)}
            >
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {detail?.nama} - Skor {detail?.skor}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        {detail?.detail.map((item, index) => (
                            <div
                                key={index}
                                className="border-sidebar-border/70 dark:border-sidebar-border rounded-lg border p-3"
                            >
                                <p className="text-sm font-medium">
                                    {index + 1}. {item.soal}
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">
                                    Jawaban: {item.jawaban || '(kosong)'}
                                </p>
                                <p className="mt-1 text-sm font-medium">
                                    Skor: {item.skor}
                                </p>
                                {item.review_ai && (
                                    <p className="text-muted-foreground mt-1 text-sm italic">
                                        Review AI: {item.review_ai}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
