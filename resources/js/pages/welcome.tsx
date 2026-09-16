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
            <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="flex flex-col items-center gap-6 pt-10 pb-10">
                        <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-xl">
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
