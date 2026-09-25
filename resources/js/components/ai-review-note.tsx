import { Bot } from 'lucide-react';

export function AiReviewNote({ text }: { text: string }) {
    return (
        <div className="border-primary/20 bg-primary/5 mt-2 flex items-start gap-2 rounded-lg border p-2.5">
            <div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full">
                <Bot className="size-3.5" />
            </div>
            <div>
                <p className="text-primary text-xs font-semibold">Dinilai AI</p>
                <p className="text-muted-foreground mt-0.5 text-sm">{text}</p>
            </div>
        </div>
    );
}
