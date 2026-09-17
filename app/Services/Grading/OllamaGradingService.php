<?php

namespace App\Services\Grading;

use App\Models\Kuis;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Grades a student's essay answer by asking a hosted Ollama model to
 * compare it against the teacher's expected answer and answer key.
 */
class OllamaGradingService implements GradingService
{
    public function grade(Kuis $kuis, string $jawabanSiswa): GradingResult
    {
        try {
            $response = Http::withToken((string) config('services.ollama.key'))
                ->timeout(60)
                ->retry(2, 500)
                ->post((string) config('services.ollama.url'), [
                    'model' => config('services.ollama.model'),
                    'stream' => false,
                    'format' => 'json',
                    'messages' => [
                        ['role' => 'system', 'content' => $this->systemPrompt()],
                        ['role' => 'user', 'content' => $this->userPrompt($kuis, $jawabanSiswa)],
                    ],
                ])
                ->throw();

            $content = (string) data_get($response->json(), 'message.content', '');
            $result = $this->parseResult($content);

            if ($result !== null) {
                return $result;
            }

            Log::warning('Penilaian AI: respons tidak dapat diproses.', ['content' => $content]);
        } catch (Throwable $e) {
            Log::error('Penilaian AI gagal.', ['error' => $e->getMessage()]);
        }

        return new GradingResult(
            skor: 0,
            review: 'Penilaian otomatis gagal diproses. Jawaban ini perlu ditinjau ulang oleh guru.',
        );
    }

    protected function systemPrompt(): string
    {
        return <<<'PROMPT'
            Kamu adalah asisten guru sejarah yang menilai jawaban esai singkat siswa SMA.
            Nilai jawaban siswa dari 0 sampai 100 berdasarkan seberapa lengkap dan tepat jawaban
            tersebut dibandingkan dengan jawaban guru dan poin-poin kunci yang diharapkan.
            Berikan juga catatan singkat (1-2 kalimat, berbahasa Indonesia, sapa siswa dengan "kamu")
            yang membangun dan membantu siswa memperbaiki jawabannya.
            Balas HANYA dalam format JSON, tanpa teks lain, dengan struktur persis:
            {"skor": <angka 0-100>, "review": "<catatan singkat>"}
            PROMPT;
    }

    protected function userPrompt(Kuis $kuis, string $jawabanSiswa): string
    {
        $jawabanSiswa = trim($jawabanSiswa) !== '' ? $jawabanSiswa : '(siswa tidak menjawab)';

        return <<<PROMPT
            Soal: {$kuis->soal}

            Jawaban guru (referensi): {$kuis->jawaban_ekspektasi}

            Poin kunci yang diharapkan:
            {$kuis->key_jawaban}

            Jawaban siswa: {$jawabanSiswa}
            PROMPT;
    }

    protected function parseResult(string $content): ?GradingResult
    {
        $content = trim($content);
        $data = json_decode($content, true);

        if (! is_array($data) && preg_match('/\{.*\}/s', $content, $matches)) {
            $data = json_decode($matches[0], true);
        }

        if (! is_array($data) || ! isset($data['skor'], $data['review'])) {
            return null;
        }

        $skor = (int) round((float) $data['skor']);
        $skor = max(0, min(100, $skor));

        $review = trim((string) $data['review']);
        if ($review === '') {
            return null;
        }

        return new GradingResult(skor: $skor, review: $review);
    }
}
