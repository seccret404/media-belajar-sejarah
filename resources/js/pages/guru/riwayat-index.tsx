import { Head, router } from '@inertiajs/react';
import { Inbox, Search } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { AiReviewNote } from '@/components/ai-review-note';
import { Badge } from '@/components/ui/badge';
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
import { initials, scoreBadgeClass } from '@/lib/utils';

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
                        <div className="relative">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nama siswa atau tahun angkatan"
                                className="w-64 max-w-full pl-8"
                            />
                        </div>
                    </div>
                    <Button type="submit" variant="secondary">
                        Cari
                    </Button>
                </form>

                {riwayat.length === 0 && (
                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-xl border py-16 text-center">
                        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                            <Inbox className="size-6" />
                        </div>
                        <p className="text-sm">
                            Belum ada siswa yang mengerjakan kuis.
                        </p>
                    </div>
                )}

                {/* Mobile: stacked cards instead of a horizontally-cramped table */}
                {riwayat.length > 0 && (
                    <div className="flex flex-col gap-2 md:hidden">
                        {riwayat.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setDetail(item)}
                                className="hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3 text-left transition-colors"
                            >
                                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                    {initials(item.nama)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {item.nama}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs">
                                        {item.modul}
                                        {item.angkatan
                                            ? ` · Angkatan ${item.angkatan}`
                                            : ''}
                                    </p>
                                </div>
                                <Badge className={scoreBadgeClass(item.skor)}>
                                    {item.skor}
                                </Badge>
                            </button>
                        ))}
                    </div>
                )}

                {/* Desktop: full table */}
                {riwayat.length > 0 && (
                    <div className="hidden overflow-hidden rounded-xl border md:block">
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
                                {riwayat.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                                    {initials(item.nama)}
                                                </div>
                                                {item.nama}
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.angkatan}</TableCell>
                                        <TableCell>{item.modul}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={scoreBadgeClass(
                                                    item.skor,
                                                )}
                                            >
                                                {item.skor}
                                            </Badge>
                                        </TableCell>
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
                )}
            </div>

            <Dialog
                open={detail !== null}
                onOpenChange={(open) => !open && setDetail(null)}
            >
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex flex-wrap items-center gap-2">
                            {detail?.nama} - {detail?.modul}
                            {detail && (
                                <Badge className={scoreBadgeClass(detail.skor)}>
                                    Skor {detail.skor}
                                </Badge>
                            )}
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
                                <Badge
                                    className={`mt-2 ${scoreBadgeClass(item.skor)}`}
                                >
                                    Skor {item.skor}
                                </Badge>
                                {item.review_ai && (
                                    <AiReviewNote text={item.review_ai} />
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
