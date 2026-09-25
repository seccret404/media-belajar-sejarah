import {
    GraduationCap,
    Info,
    Lightbulb,
    Sparkles,
    Target,
} from 'lucide-react';
import developerPhoto from '@/assets/developer-photo.jpg';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const TUJUAN_PENGEMBANGAN = [
    {
        icon: Lightbulb,
        label: 'Membantu pemahaman siswa',
        accent: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    },
    {
        icon: Sparkles,
        label: 'Meningkatkan interaktivitas belajar',
        accent: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    },
    {
        icon: Target,
        label: 'Mendukung pembelajaran mandiri',
        accent: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    },
];

export function DeveloperInfoDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    <Info className="size-4" />
                    <span className="hidden sm:inline">Info Pengembang</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden sm:max-w-md">
                <DialogTitle className="sr-only">Info Pengembang</DialogTitle>

                {/* Scattered decorative blobs instead of a solid banner */}
                <div className="absolute -top-10 -left-10 size-32 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
                <div className="absolute -top-8 -right-12 size-32 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-400/10" />
                <div className="bg-emerald-300/15 absolute right-10 bottom-0 size-24 rounded-full blur-3xl dark:bg-emerald-400/10" />

                <div className="relative flex flex-col items-center text-center">
                    {/* Tilted photo card */}
                    <div className="animate-in zoom-in-50 fade-in-0 relative">
                        <div className="from-primary rotate-[-4deg] rounded-2xl bg-gradient-to-br to-blue-700 p-1.5 shadow-lg">
                            <img
                                src={developerPhoto}
                                alt="Foto Rahmi Isnaini"
                                className="size-32 rounded-xl object-cover"
                                style={{ objectPosition: '50% 42%' }}
                            />
                        </div>
                        <div className="bg-background ring-primary/20 absolute -right-3 -bottom-2 flex size-9 items-center justify-center rounded-full shadow-md ring-2">
                            <GraduationCap className="text-primary size-4" />
                        </div>
                        <Sparkles className="text-primary/50 absolute -top-3 -left-4 size-4" />
                    </div>

                    <div
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards mt-4"
                        style={{ animationDelay: '80ms' }}
                    >
                        <h2 className="text-xl font-bold">Rahmi Isnaini</h2>
                        <span className="bg-primary/10 text-primary mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                            <GraduationCap className="size-3.5" />
                            Pengembang & Peneliti
                        </span>
                    </div>

                    <p
                        className="text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards mt-1 text-xs"
                        style={{ animationDelay: '120ms' }}
                    >
                        Pendidikan Teknologi Informatika dan Komputer
                        <br />
                        Universitas Negeri Medan
                    </p>

                    <div
                        className="bg-muted/30 animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards relative mt-4 rounded-xl border p-4"
                        style={{ animationDelay: '160ms' }}
                    >
                        <span className="text-primary/15 absolute -top-3 -left-1 font-serif text-5xl leading-none">
                            &ldquo;
                        </span>
                        <p className="text-muted-foreground relative text-sm leading-relaxed">
                            Halo, saya Rahmi Isnaini. Media pembelajaran
                            berbasis website ini dikembangkan sebagai bagian
                            dari penelitian pengembangan untuk membantu siswa
                            memahami materi Sejarah secara lebih interaktif.
                        </p>
                    </div>

                    <div
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards mt-4 w-full"
                        style={{ animationDelay: '200ms' }}
                    >
                        <p className="mb-2 flex items-center justify-center gap-1.5 text-sm font-semibold">
                            <Sparkles className="text-primary size-4" />
                            Tujuan Pengembangan
                        </p>
                        <div className="flex flex-col gap-2">
                            {TUJUAN_PENGEMBANGAN.map((item, i) => (
                                <div
                                    key={item.label}
                                    className="bg-background/60 animate-in fade-in-0 slide-in-from-left-2 fill-mode-backwards flex items-center gap-3 rounded-lg border p-2.5 text-left"
                                    style={{
                                        animationDelay: `${240 + i * 60}ms`,
                                    }}
                                >
                                    <div
                                        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${item.accent}`}
                                    >
                                        <item.icon className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
