export type CalloutTone = 'tip' | 'fact' | 'example';

export type ContentBlock =
    | { type: 'callout'; tone: CalloutTone; title: string; lines: string[] }
    | { type: 'timeline'; items: { year: string; text: string }[] }
    | { type: 'list'; heading?: string; items: string[] }
    | { type: 'paragraph'; label?: string; text: string };

const CALLOUT_PATTERNS: { regex: RegExp; tone: CalloutTone }[] = [
    { regex: /^tahukah kamu[:!?]?$/i, tone: 'fact' },
    {
        regex: /^(ingat(\s+konsep\s+ini)?|coba perhatikan)[:!?]?$/i,
        tone: 'tip',
    },
    {
        regex: /^(contoh(nya)?|contoh sederhana|misalnya|coba bayangkan)[:!?]?$/i,
        tone: 'example',
    },
];

const TIMELINE_LINE = /^↓?\s*(\d{3,4})\s*→\s*(.+)$/;

function classifyCallout(line: string): CalloutTone | null {
    const trimmed = line.trim();

    for (const { regex, tone } of CALLOUT_PATTERNS) {
        if (regex.test(trimmed)) {
            return tone;
        }
    }

    return null;
}

export function parseSectionContent(konten: string): ContentBlock[] {
    const lines = konten.split('\n').map((line) => line.trim());
    const blocks: ContentBlock[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (!line) {
            i++;
            continue;
        }

        const tone = classifyCallout(line);
        if (tone) {
            const body: string[] = [];
            i++;
            while (
                i < lines.length &&
                lines[i] &&
                !lines[i].startsWith('-') &&
                !classifyCallout(lines[i]) &&
                !TIMELINE_LINE.test(lines[i])
            ) {
                body.push(lines[i]);
                i++;
            }
            blocks.push({
                type: 'callout',
                tone,
                title: line.replace(/[:!?]+$/, ''),
                lines: body,
            });
            continue;
        }

        if (TIMELINE_LINE.test(line)) {
            const items: { year: string; text: string }[] = [];
            while (i < lines.length && TIMELINE_LINE.test(lines[i])) {
                const match = TIMELINE_LINE.exec(lines[i]);
                if (match) {
                    items.push({ year: match[1], text: match[2] });
                }
                i++;
            }
            blocks.push({ type: 'timeline', items });
            continue;
        }

        if (line.startsWith('-')) {
            const items: string[] = [];
            while (i < lines.length && lines[i].startsWith('-')) {
                items.push(lines[i].replace(/^-+\s*/, ''));
                i++;
            }

            const prev = blocks[blocks.length - 1];
            let heading: string | undefined;
            if (
                prev?.type === 'paragraph' &&
                !prev.label &&
                prev.text.length < 60 &&
                prev.text.endsWith(':')
            ) {
                blocks.pop();
                heading = prev.text;
            }

            blocks.push({ type: 'list', heading, items });
            continue;
        }

        const isLabel =
            line.length <= 30 &&
            !/[.?!]$/.test(line) &&
            (line.endsWith(':') || line.split(/\s+/).length <= 3);
        const next = lines[i + 1];
        const nextIsValue =
            !!next &&
            next.length > 10 &&
            !next.startsWith('-') &&
            !classifyCallout(next) &&
            !TIMELINE_LINE.test(next);

        if (isLabel && nextIsValue) {
            blocks.push({
                type: 'paragraph',
                label: line.replace(/:+$/, ''),
                text: next,
            });
            i += 2;
            continue;
        }

        blocks.push({ type: 'paragraph', text: line });
        i++;
    }

    return blocks;
}

const ARROW_LINE = /^(.{1,30}?)\s*→\s*(.+)$/;

export function parseArrowLine(
    text: string,
): { term: string; text: string } | null {
    if (TIMELINE_LINE.test(text)) {
        return null;
    }

    const match = ARROW_LINE.exec(text);
    return match ? { term: match[1], text: match[2] } : null;
}

export function splitVisualLines(text: string): string[] {
    return text.split(' ');
}
