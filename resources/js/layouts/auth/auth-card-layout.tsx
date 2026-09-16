import { BookOpen } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
            <div
                aria-hidden
                className="bg-primary/20 animate-float pointer-events-none absolute -top-24 -left-24 size-72 rounded-full blur-3xl"
            />
            <div
                aria-hidden
                className="bg-secondary/20 animate-float-delayed pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full blur-3xl"
            />

            <div className="animate-in fade-in-0 zoom-in-95 relative flex w-full max-w-md flex-col gap-6 duration-500">
                <Card className="rounded-xl shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-3 px-10 pt-8 pb-0 text-center">
                        <div className="from-primary to-primary/70 text-primary-foreground flex size-12 items-center justify-center rounded-full bg-gradient-to-br shadow-md">
                            <BookOpen className="size-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
