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
import guru from '@/routes/guru';

type DetailItem = {
    soal: string;
    jawaban: string;
    skor: number;
    review_ai: string | null;
};

type Riwayat = {
    id: string;
    nama: string;
    angkatan: number | null;
    modul: string;
    skor: number;
    detail: DetailItem[];
};

export default function GuruRiwayatIndex({
    riwayat,
    filters,
}: {
    riwayat: Riwayat[];
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const [detail, setDetail] = useState<Riwayat | null>(null);

    const applyFilters: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            guru.riwayat.index().url,
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Riwayat Kuis" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Riwayat Kuis</h1>
                    <p className="text-muted-foreground text-sm">
                        Riwayat pengerjaan kuis seluruh siswa.
                    </p>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="flex flex-wrap items-end gap-2"
                >
                    <div className="grid gap-1">
                        <label className="text-sm font-medium">
                            Cari nama atau angkatan
                        </label>
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nama siswa atau tahun angkatan"
                            className="w-64"
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
                                <TableHead>Modul</TableHead>
                                <TableHead>Skor</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {riwayat.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-muted-foreground text-center"
                                    >
                                        Belum ada siswa yang mengerjakan kuis.
                                    </TableCell>
                                </TableRow>
                            )}
                            {riwayat.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>{item.angkatan}</TableCell>
                                    <TableCell>{item.modul}</TableCell>
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
                            {detail?.nama} - {detail?.modul} - Skor{' '}
                            {detail?.skor}
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
        </>
    );
}

GuruRiwayatIndex.layout = {
    breadcrumbs: [{ title: 'Riwayat Kuis', href: guru.riwayat.index() }],
};
