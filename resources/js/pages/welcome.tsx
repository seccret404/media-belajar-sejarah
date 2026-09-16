import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Selamat Datang" />
            <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
                <div
                    aria-hidden
                    className="bg-primary/20 animate-float pointer-events-none absolute -top-20 -left-20 size-72 rounded-full blur-3xl"
                />
                <div
                    aria-hidden
                    className="bg-secondary/20 animate-float-delayed pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full blur-3xl"
                />

                <Card className="animate-in fade-in-0 zoom-in-95 relative w-full max-w-md text-center shadow-lg duration-500">
                    <CardContent className="flex flex-col items-center gap-6 pt-10 pb-10">
                        <div className="from-primary to-primary/70 text-primary-foreground animate-float flex size-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-md">
                            <BookOpen className="size-7" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold">
                                Media Belajar Sejarah
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm">
                                Platform belajar sejarah untuk guru dan siswa —
                                baca modul, kerjakan kuis, dan pantau
                                perkembangan belajarmu.
                            </p>
                        </div>

                        {auth.user ? (
                            <Button asChild className="w-full">
                                <Link href={dashboard()}>Buka Dashboard</Link>
                            </Button>
                        ) : (
                            <div className="flex w-full flex-col gap-2">
                                <Button asChild className="w-full">
                                    <Link href={login()}>Masuk</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link href={register()}>
                                        Daftar sebagai siswa
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
