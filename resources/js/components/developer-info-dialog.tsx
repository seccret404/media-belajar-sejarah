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
            <DialogContent className="overflow-hidden p-0 sm:max-w-md [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-90 [&_[data-slot=dialog-close]]:hover:bg-white/10 [&_[data-slot=dialog-close]]:hover:opacity-100">
                <DialogTitle className="sr-only">Info Pengembang</DialogTitle>

                {/* Aurora banner */}
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
                    <div className="absolute -top-8 -left-6 size-32 rounded-full bg-sky-400/40 blur-2xl" />
                    <div className="absolute top-2 -right-4 size-28 rounded-full bg-fuchsia-400/30 blur-2xl" />
                    <div className="absolute bottom-0 left-1/3 size-24 rounded-full bg-emerald-300/20 blur-2xl" />
                    <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]" />
                    <Sparkles className="absolute top-4 right-14 size-4 animate-pulse text-white/50" />
                    <Sparkles className="absolute top-10 right-24 size-3 text-white/30" />
                    <Sparkles className="absolute bottom-3 left-8 size-3 text-white/30" />
                </div>

                <div className="-mt-14 flex flex-col items-center px-6 pb-6 text-center">
                    <div className="animate-in zoom-in-50 fade-in-0 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 p-1 shadow-xl">
                        <img
                            src={developerPhoto}
                            alt="Foto Rahmi Isnaini"
                            className="border-background size-28 rounded-full border-4 object-cover"
                        />
                    </div>

                    <div
                        className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards mt-3"
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
